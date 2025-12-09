export type ValidationStatus = 'pending' | 'valid' | 'invalid'

export interface SensorPayload {
  volumetric_water_content?: number
  electrical_conductivity?: number
  temperature?: number
  ph?: number
  battery?: number
}

export interface SensorPacket {
  id: string
  sensor_id: string
  farm_id: string
  collected_at: string
  payload: SensorPayload
  validation_flags: string[]
  status: ValidationStatus
}

export interface Recommendation {
  action: string
  priority: 'high' | 'medium' | 'low'
  rationale: string
  confidence: number
  dosage?: string
}

export interface SoilAnalysis {
  id: string
  packet_id: string
  created_at: string
  status: 'processing' | 'completed' | 'failed'
  crop_type: string
  soil_health_score: number
  moisture_status: 'deficit' | 'optimal' | 'excess'
  recommendations: Recommendation[]
  explanation: string
}

export interface ValidationResult {
  isValid: boolean
  flags: string[]
  status: ValidationStatus
}

interface RangeLimit {
  min: number
  max: number
  unit?: string
}

interface MoistureThresholds {
  deficit: number
  excess: number
  target: number
}

interface BatteryThresholds {
  low: number
  critical: number
}

interface TemperatureThresholds {
  stressLow: number
  stressHigh: number
}

interface AlgorithmConstants {
  RANGES: {
    moisture: RangeLimit
    ec: RangeLimit
    temp: RangeLimit
    ph: RangeLimit
  }
  THRESHOLDS: {
    moisture: MoistureThresholds
    ec: { risk: number }
    ph: { acidic: number; alkaline: number; target: number }
    battery: BatteryThresholds
    temperature: TemperatureThresholds
  }
  DOSAGE: {
    water_per_percent_deficit: number
    lime_per_ph_deficit: number
    sulfur_per_ph_excess: number
  }
}

export const ALGORITHM_CONSTANTS: AlgorithmConstants = {
  RANGES: {
    moisture: { min: 0, max: 60, unit: '%' },
    ec: { min: 0, max: 10, unit: 'dS/m' },
    temp: { min: -10, max: 60, unit: '°C' },
    ph: { min: 3.5, max: 9.5, unit: 'pH' },
  },
  THRESHOLDS: {
    moisture: { deficit: 25, excess: 45, target: 35 },
    ec: { risk: 4.0 },
    ph: { acidic: 5.5, alkaline: 7.5, target: 6.5 },
    battery: { low: 0.2, critical: 0.1 },
    temperature: { stressLow: 5, stressHigh: 40 },
  },
  DOSAGE: {
    water_per_percent_deficit: 4,
    lime_per_ph_deficit: 1.2,
    sulfur_per_ph_excess: 0.8,
  },
}

const PRIORITY_ORDER: Record<Recommendation['priority'], number> = {
  high: 3,
  medium: 2,
  low: 1,
}

const isOutOfRange = (value: number | undefined, { min, max }: RangeLimit) => {
  if (value === undefined) return false
  return value < min || value > max
}

const flagIfOutOfRange = (flags: string[], value: number | undefined, key: string, range: RangeLimit) => {
  if (isOutOfRange(value, range)) {
    flags.push(`${key}_out_of_range`)
  }
}

const sortRecommendations = (recommendations: Recommendation[]) =>
  recommendations.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority])

const formatPercentage = (value: number) => `${(value * 100).toFixed(0)}%`

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

const buildExplanation = (count: number) =>
  count > 0
    ? `${count} actionable item${count === 1 ? '' : 's'} identified using Tier A heuristics.`
    : 'Soil conditions and sensor health are optimal.'

export const generateUUID = () => {
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.random() * 16 | 0
    const value = character === 'x' ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

const evaluateMoisture = (moisture: number | undefined, recommendations: Recommendation[]) => {
  if (moisture === undefined) return { moistureStatus: 'optimal' as SoilAnalysis['moisture_status'], scoreDelta: 0 }

  if (moisture < ALGORITHM_CONSTANTS.THRESHOLDS.moisture.deficit) {
    const deficit = ALGORITHM_CONSTANTS.THRESHOLDS.moisture.target - moisture
    const waterMm = Math.ceil(deficit * ALGORITHM_CONSTANTS.DOSAGE.water_per_percent_deficit)

    recommendations.push({
      action: 'Initiate Irrigation',
      priority: 'high',
      rationale: `Moisture (${moisture}%) critical. Target: ${ALGORITHM_CONSTANTS.THRESHOLDS.moisture.target}%.`,
      confidence: 0.95,
      dosage: `Apply ${waterMm}mm water`,
    })

    return { moistureStatus: 'deficit' as SoilAnalysis['moisture_status'], scoreDelta: -20 }
  }

  if (moisture > ALGORITHM_CONSTANTS.THRESHOLDS.moisture.excess) {
    recommendations.push({
      action: 'Pause Irrigation',
      priority: 'medium',
      rationale: `Moisture (${moisture}%) indicates saturation risk.`,
      confidence: 0.9,
      dosage: 'Skip next scheduled cycle',
    })

    return { moistureStatus: 'excess' as SoilAnalysis['moisture_status'], scoreDelta: -10 }
  }

  return { moistureStatus: 'optimal' as SoilAnalysis['moisture_status'], scoreDelta: 0 }
}

const evaluateElectricalConductivity = (ec: number | undefined, recommendations: Recommendation[]) => {
  if (ec === undefined) return 0

  if (ec > ALGORITHM_CONSTANTS.THRESHOLDS.ec.risk) {
    recommendations.push({
      action: 'Flush Soil',
      priority: 'high',
      rationale: `EC (${ec} dS/m) indicates high salinity stress risk.`,
      confidence: 0.85,
      dosage: 'Apply leaching fraction (+15% water)',
    })

    return -30
  }

  return 0
}

const evaluateTemperature = (temperature: number | undefined, recommendations: Recommendation[]) => {
  if (temperature === undefined) return 0

  if (
    temperature < ALGORITHM_CONSTANTS.THRESHOLDS.temperature.stressLow ||
    temperature > ALGORITHM_CONSTANTS.THRESHOLDS.temperature.stressHigh
  ) {
    recommendations.push({
      action: 'Adjust Microclimate',
      priority: 'medium',
      rationale: `Temperature (${temperature}°C) is outside ideal range (${ALGORITHM_CONSTANTS.THRESHOLDS.temperature.stressLow}-${ALGORITHM_CONSTANTS.THRESHOLDS.temperature.stressHigh}°C).`,
      confidence: 0.82,
      dosage: 'Increase shading/ventilation or delay irrigation',
    })

    return -10
  }

  return 0
}

const evaluatePh = (ph: number | undefined, recommendations: Recommendation[]) => {
  if (ph === undefined) return 0

  if (ph < ALGORITHM_CONSTANTS.THRESHOLDS.ph.acidic) {
    const deficit = ALGORITHM_CONSTANTS.THRESHOLDS.ph.target - ph
    const limeTons = (deficit * ALGORITHM_CONSTANTS.DOSAGE.lime_per_ph_deficit).toFixed(1)

    recommendations.push({
      action: 'Apply Lime',
      priority: 'medium',
      rationale: `pH (${ph}) is too acidic. Target: ${ALGORITHM_CONSTANTS.THRESHOLDS.ph.target}.`,
      confidence: 0.8,
      dosage: `Apply ${limeTons} tons/ha`,
    })

    return -15
  }

  if (ph > ALGORITHM_CONSTANTS.THRESHOLDS.ph.alkaline) {
    const excess = ph - ALGORITHM_CONSTANTS.THRESHOLDS.ph.target
    const sulfurTons = (excess * ALGORITHM_CONSTANTS.DOSAGE.sulfur_per_ph_excess).toFixed(1)

    recommendations.push({
      action: 'Apply Sulfur',
      priority: 'medium',
      rationale: `pH (${ph}) is too alkaline. Target: ${ALGORITHM_CONSTANTS.THRESHOLDS.ph.target}.`,
      confidence: 0.8,
      dosage: `Apply ${sulfurTons} tons/ha`,
    })

    return -15
  }

  return 0
}

const evaluateBattery = (battery: number | undefined, recommendations: Recommendation[]) => {
  if (battery === undefined) return 0

  if (battery < ALGORITHM_CONSTANTS.THRESHOLDS.battery.low) {
    recommendations.push({
      action: 'Sensor Maintenance',
      priority: 'low',
      rationale: `Battery level low (${formatPercentage(battery)}). Risk of data loss.`,
      confidence: 0.99,
      dosage: 'Replace battery unit',
    })

    return -5
  }

  return 0
}

export class SoilAnalysisEngine {
  static validatePacket(payload: SensorPayload): ValidationResult {
    const flags: string[] = []

    flagIfOutOfRange(flags, payload.volumetric_water_content, 'moisture', ALGORITHM_CONSTANTS.RANGES.moisture)
    flagIfOutOfRange(flags, payload.electrical_conductivity, 'ec', ALGORITHM_CONSTANTS.RANGES.ec)
    flagIfOutOfRange(flags, payload.temperature, 'temp', ALGORITHM_CONSTANTS.RANGES.temp)
    flagIfOutOfRange(flags, payload.ph, 'ph', ALGORITHM_CONSTANTS.RANGES.ph)

    if (payload.battery !== undefined && payload.battery < ALGORITHM_CONSTANTS.THRESHOLDS.battery.critical) {
      flags.push('critical_battery')
    }

    const isValid = flags.every((flag) => !flag.endsWith('out_of_range'))
    const status: ValidationStatus = isValid ? 'valid' : 'invalid'

    return { isValid, flags, status }
  }

  static generateAnalysis(packet: SensorPacket, cropType = 'Corn'): SoilAnalysis {
    const { payload } = packet
    const validation = this.validatePacket(payload)
    if (!validation.isValid) {
      return {
        id: generateUUID(),
        packet_id: packet.id,
        created_at: new Date().toISOString(),
        status: 'failed',
        crop_type: cropType,
        soil_health_score: 0,
        moisture_status: 'optimal',
        recommendations: [],
        explanation: `Invalid packet: ${validation.flags.join(', ') || 'unknown validation error'}`,
      }
    }
    const recommendations: Recommendation[] = []

    const { moistureStatus, scoreDelta: moistureDelta } = evaluateMoisture(
      payload.volumetric_water_content,
      recommendations,
    )

    const scoreAfterEc = 100 + moistureDelta + evaluateElectricalConductivity(
      payload.electrical_conductivity,
      recommendations,
    )

    const scoreAfterPh = scoreAfterEc + evaluatePh(payload.ph, recommendations)
    const scoreAfterTemp = scoreAfterPh + evaluateTemperature(payload.temperature, recommendations)
    const finalScore = scoreAfterTemp + evaluateBattery(payload.battery, recommendations)

    return {
      id: generateUUID(),
      packet_id: packet.id,
      created_at: new Date().toISOString(),
      status: 'completed',
      crop_type: cropType,
      soil_health_score: clampScore(finalScore),
      moisture_status: moistureStatus,
      recommendations: sortRecommendations(recommendations),
      explanation: buildExplanation(recommendations.length),
    }
  }
}
