export type ValidationStatus = 'pending' | 'valid' | 'invalid';

export interface SensorPayload {
  volumetric_water_content?: number; // 0-60%
  electrical_conductivity?: number;  // 0-10 dS/m
  temperature?: number;              // -10 to 60 C
  ph?: number;                       // 3.5-9.5
  battery?: number;                  // 0.0 - 1.0 (Percentage)
}

export interface SensorPacket {
  id: string;
  sensor_id: string;
  farm_id: string;
  collected_at: string;
  payload: SensorPayload;
  validation_flags: string[];
  status: ValidationStatus;
}

export interface Recommendation {
  action: string;
  priority: 'high' | 'medium' | 'low';
  rationale: string;
  confidence: number;
  dosage?: string;
}

export interface SoilAnalysis {
  id: string;
  packet_id: string;
  created_at: string;
  status: 'processing' | 'completed' | 'failed';
  crop_type: string;
  soil_health_score: number;
  moisture_status: 'deficit' | 'optimal' | 'excess';
  recommendations: Recommendation[];
  explanation: string;
}

export const ALGORITHM_CONSTANTS = {
  RANGES: {
    moisture: { min: 0, max: 60, unit: '%' },
    ec: { min: 0, max: 10, unit: 'dS/m' },
    temp: { min: -10, max: 60, unit: '°C' },
    ph: { min: 3.5, max: 9.5, unit: 'pH' }
  },
  THRESHOLDS: {
    moisture: { deficit: 25, excess: 45, target: 35 },
    ec: { risk: 4.0 },
    ph: { acidic: 5.5, alkaline: 7.5, target: 6.5 },
    battery: { low: 0.2, critical: 0.1 }
  },
  DOSAGE: {
    water_per_percent_deficit: 4, // mm of water per 1% moisture deficit
    lime_per_ph_deficit: 1.2,     // tons/ha per 1.0 pH unit below target
    sulfur_per_ph_excess: 0.8     // tons/ha per 1.0 pH unit above target
  }
};

// Robust UUID generator
export const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export class SoilAnalysisEngine {

  // 1. Validation Layer
  static validatePacket(payload: SensorPayload): { isValid: boolean, flags: string[] } {
    const flags: string[] = [];

    // Range Checks (Hard Limits)
    if (payload.volumetric_water_content !== undefined) {
      if (payload.volumetric_water_content < ALGORITHM_CONSTANTS.RANGES.moisture.min ||
          payload.volumetric_water_content > ALGORITHM_CONSTANTS.RANGES.moisture.max) {
        flags.push('moisture_out_of_range');
      }
    }

    if (payload.electrical_conductivity !== undefined) {
      if (payload.electrical_conductivity < ALGORITHM_CONSTANTS.RANGES.ec.min ||
          payload.electrical_conductivity > ALGORITHM_CONSTANTS.RANGES.ec.max) {
        flags.push('ec_out_of_range');
      }
    }

    if (payload.temperature !== undefined) {
      if (payload.temperature < ALGORITHM_CONSTANTS.RANGES.temp.min ||
          payload.temperature > ALGORITHM_CONSTANTS.RANGES.temp.max) {
        flags.push('temp_out_of_range');
      }
    }

    if (payload.ph !== undefined) {
      if (payload.ph < ALGORITHM_CONSTANTS.RANGES.ph.min ||
          payload.ph > ALGORITHM_CONSTANTS.RANGES.ph.max) {
        flags.push('ph_out_of_range');
      }
    }

    // Soft Validation (Battery check doesn't invalidate packet, but flags it)
    if (payload.battery !== undefined && payload.battery < ALGORITHM_CONSTANTS.THRESHOLDS.battery.critical) {
      flags.push('critical_battery');
    }

    // A packet is invalid only if it violates hard physical ranges
    const isValid = flags.filter(f => f.endsWith('out_of_range')).length === 0;

    return { isValid, flags };
  }

  // 2. Heuristic Modeling Layer
  static generateAnalysis(packet: SensorPacket, cropType: string = 'Corn'): SoilAnalysis {
    const { payload } = packet;
    const recommendations: Recommendation[] = [];
    let moistureStatus: SoilAnalysis['moisture_status'] = 'optimal';
    let healthScore = 100;

    // --- Moisture Logic & Dosage ---
    if (payload.volumetric_water_content !== undefined) {
      if (payload.volumetric_water_content < ALGORITHM_CONSTANTS.THRESHOLDS.moisture.deficit) {
        moistureStatus = 'deficit';
        healthScore -= 20;

        // Calculate dosage based on deficit from target
        const deficit = ALGORITHM_CONSTANTS.THRESHOLDS.moisture.target - payload.volumetric_water_content;
        const waterMm = Math.ceil(deficit * ALGORITHM_CONSTANTS.DOSAGE.water_per_percent_deficit);

        recommendations.push({
          action: 'Initiate Irrigation',
          priority: 'high',
          rationale: `Moisture (${payload.volumetric_water_content}%) critical. Target: ${ALGORITHM_CONSTANTS.THRESHOLDS.moisture.target}%.`,
          confidence: 0.95,
          dosage: `Apply ${waterMm}mm water`
        });
      } else if (payload.volumetric_water_content > ALGORITHM_CONSTANTS.THRESHOLDS.moisture.excess) {
        moistureStatus = 'excess';
        healthScore -= 10;
        recommendations.push({
          action: 'Pause Irrigation',
          priority: 'medium',
          rationale: `Moisture (${payload.volumetric_water_content}%) indicates saturation risk.`,
          confidence: 0.90,
          dosage: 'Skip next scheduled cycle'
        });
      }
    }

    // --- EC Logic (Salinity) ---
    if (payload.electrical_conductivity !== undefined) {
      if (payload.electrical_conductivity > ALGORITHM_CONSTANTS.THRESHOLDS.ec.risk) {
        healthScore -= 30;
        recommendations.push({
          action: 'Flush Soil',
          priority: 'high',
          rationale: `EC (${payload.electrical_conductivity} dS/m) indicates high salinity stress risk.`,
          confidence: 0.85,
          dosage: 'Apply leaching fraction (+15% water)'
        });
      }
    }

    // --- pH Logic & Dosage ---
    if (payload.ph !== undefined) {
      if (payload.ph < ALGORITHM_CONSTANTS.THRESHOLDS.ph.acidic) {
        healthScore -= 15;
        const deficit = ALGORITHM_CONSTANTS.THRESHOLDS.ph.target - payload.ph;
        const limeTons = (deficit * ALGORITHM_CONSTANTS.DOSAGE.lime_per_ph_deficit).toFixed(1);

        recommendations.push({
          action: 'Apply Lime',
          priority: 'medium',
          rationale: `pH (${payload.ph}) is too acidic. Target: ${ALGORITHM_CONSTANTS.THRESHOLDS.ph.target}.`,
          confidence: 0.80,
          dosage: `Apply ${limeTons} tons/ha`
        });
      } else if (payload.ph > ALGORITHM_CONSTANTS.THRESHOLDS.ph.alkaline) {
        healthScore -= 15;
        const excess = payload.ph - ALGORITHM_CONSTANTS.THRESHOLDS.ph.target;
        const sulfurTons = (excess * ALGORITHM_CONSTANTS.DOSAGE.sulfur_per_ph_excess).toFixed(1);

        recommendations.push({
          action: 'Apply Sulfur',
          priority: 'medium',
          rationale: `pH (${payload.ph}) is too alkaline. Target: ${ALGORITHM_CONSTANTS.THRESHOLDS.ph.target}.`,
          confidence: 0.80,
          dosage: `Apply ${sulfurTons} tons/ha`
        });
      }
    }

    // --- Sensor Health Logic ---
    if (payload.battery !== undefined && payload.battery < ALGORITHM_CONSTANTS.THRESHOLDS.battery.low) {
      healthScore -= 5;
      recommendations.push({
        action: 'Sensor Maintenance',
        priority: 'low',
        rationale: `Battery level low (${(payload.battery * 100).toFixed(0)}%). Risk of data loss.`,
        confidence: 0.99,
        dosage: 'Replace battery unit'
      });
    }

    return {
      id: generateUUID(),
      packet_id: packet.id,
      created_at: new Date().toISOString(),
      status: 'completed',
      crop_type: cropType,
      soil_health_score: Math.max(0, Math.round(healthScore)),
      moisture_status: moistureStatus,
      // Sort: High priority first
      recommendations: recommendations.sort((a, b) => {
        const priorities = { high: 3, medium: 2, low: 1 };
        return priorities[b.priority] - priorities[a.priority];
      }),
      explanation: recommendations.length > 0
        ? `${recommendations.length} actionable items identified using Tier A Heuristics.`
        : 'Soil conditions and sensor health are optimal.'
    };
  }
}
