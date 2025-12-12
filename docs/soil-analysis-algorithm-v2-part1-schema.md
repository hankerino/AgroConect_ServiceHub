# Soil Analysis Algorithm v2.0 - Part 1: Enhanced Schema & Data Model

## Overview
This enhanced version adds:
- Multi-sensor fusion capabilities
- Crop-specific context and thresholds
- Structured recommendation format
- Weather integration for ET-based irrigation
- Sensor health tracking and predictive maintenance
- Comprehensive feedback loop for ML improvement

---

## 1) Enhanced Database Schema

### Core Tables with Crop Context

```sql
-- Enhanced soil_analyses with full crop context
CREATE TABLE soil_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('pending', 'valid', 'invalid', 'scored', 'needs_review')),

  -- Context fields (NEW)
  farm_id UUID REFERENCES farms(id),
  field_id UUID REFERENCES fields(id),
  crop_type TEXT NOT NULL, -- 'maize', 'coffee', 'beans', etc.
  growth_stage TEXT, -- 'seedling', 'vegetative', 'flowering', 'fruiting'
  soil_type TEXT, -- 'clay', 'sandy_loam', 'silt'
  planting_date DATE,

  -- Multi-sensor support (NEW)
  sensor_packet_ids UUID[], -- Array of contributing sensors
  sensor_fusion_method TEXT, -- 'weighted_avg', 'spatial_interpolation', 'consensus'
  sensor_count INT,

  -- OCR reference
  ocr_doc_id UUID REFERENCES ocr_documents(id),

  -- Fused measurements
  moisture DECIMAL(5,2), -- VWC %
  moisture_confidence DECIMAL(3,2), -- 0-1, based on sensor agreement
  ec DECIMAL(5,2), -- dS/m
  temperature DECIMAL(4,1), -- °C
  ph DECIMAL(3,1),

  -- Derived risk scores
  water_stress_index DECIMAL(3,2), -- 0-1, higher = more stress
  salinity_risk_score DECIMAL(3,2),
  nutrient_proxy_score DECIMAL(5,2),

  -- Structured recommendations (NEW)
  recommendations JSONB, -- See detailed schema below
  recommendation_confidence DECIMAL(3,2),

  -- Explainability
  explanations JSONB, -- Feature importances, threshold hits
  alerts JSONB[], -- Active alerts with severity

  model_version TEXT,
  scored_at TIMESTAMPTZ,

  CONSTRAINT valid_confidence CHECK (moisture_confidence BETWEEN 0 AND 1)
);

CREATE INDEX idx_soil_analyses_field_time ON soil_analyses(field_id, created_at DESC);
CREATE INDEX idx_soil_analyses_crop ON soil_analyses(crop_type, growth_stage);
CREATE INDEX idx_soil_analyses_status ON soil_analyses(status) WHERE status IN ('valid', 'scored');

-- Sensor packets with health metrics
CREATE TABLE sensor_packets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id TEXT NOT NULL,
  hardware_version TEXT,
  farm_id UUID REFERENCES farms(id),
  field_id UUID REFERENCES fields(id),

  -- Spatiotemporal
  location GEOGRAPHY(POINT, 4326),
  collected_at TIMESTAMPTZ NOT NULL,
  transmitted_at TIMESTAMPTZ NOT NULL,
  transmission_delay_seconds INT GENERATED ALWAYS AS
    (EXTRACT(EPOCH FROM (transmitted_at - collected_at))) STORED,

  -- Reading data
  reading_type TEXT CHECK (reading_type IN ('moisture', 'ec', 'temperature', 'ph', 'combined')),
  payload JSONB NOT NULL,
  calibrated_payload JSONB, -- After applying offsets

  -- Validation
  status TEXT DEFAULT 'pending',
  validation_flags JSONB DEFAULT '[]'::jsonb,
  calibration_version TEXT,

  -- Health indicators (NEW)
  battery_level DECIMAL(3,2), -- 0-1
  signal_strength_dbm INT,
  sensor_health_score DECIMAL(3,2),
  drift_estimate DECIMAL(5,2), -- vs. neighbors

  -- Time-series quality (NEW)
  sampling_gap_minutes INT,
  rapid_sampling_flag BOOLEAN DEFAULT FALSE,

  CONSTRAINT valid_timing CHECK (transmitted_at >= collected_at),
  CONSTRAINT valid_battery CHECK (battery_level BETWEEN 0 AND 1)
);

CREATE INDEX idx_sensor_packets_sensor_time ON sensor_packets(sensor_id, collected_at DESC);
CREATE INDEX idx_sensor_packets_location ON sensor_packets USING GIST(location);
CREATE INDEX idx_sensor_packets_status ON sensor_packets(status, collected_at DESC);

-- Sensor health tracking table (NEW)
CREATE TABLE sensor_health (
  sensor_id TEXT PRIMARY KEY,
  last_reading_at TIMESTAMPTZ,
  total_readings INT DEFAULT 0,
  failed_readings INT DEFAULT 0,

  -- Battery analytics
  avg_battery_level DECIMAL(3,2),
  battery_depletion_rate DECIMAL(5,4), -- % per day
  estimated_battery_days_remaining INT,

  -- Quality metrics
  calibration_drift_score DECIMAL(3,2), -- vs. nearby sensors
  dropout_rate DECIMAL(3,2), -- % of expected readings missed
  avg_transmission_delay_seconds INT,

  -- Maintenance scheduling
  last_maintenance_date DATE,
  next_maintenance_due DATE,
  maintenance_notes TEXT[],

  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'degraded', 'maintenance_needed', 'inactive')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crop-specific thresholds library (NEW)
CREATE TABLE crop_thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_type TEXT NOT NULL,
  growth_stage TEXT, -- NULL = applies to all stages
  soil_type TEXT, -- NULL = applies to all soil types

  -- Moisture thresholds (VWC %)
  moisture_critical_min DECIMAL(5,2), -- Severe water stress
  moisture_optimal_min DECIMAL(5,2),
  moisture_optimal_max DECIMAL(5,2),
  moisture_critical_max DECIMAL(5,2), -- Waterlogging risk

  -- EC thresholds (dS/m)
  ec_optimal_min DECIMAL(5,2),
  ec_optimal_max DECIMAL(5,2),
  ec_salinity_threshold DECIMAL(5,2), -- Above this = salinity concern

  -- Temperature thresholds (°C)
  temp_optimal_min DECIMAL(4,1),
  temp_optimal_max DECIMAL(4,1),
  temp_stress_threshold DECIMAL(4,1), -- Severe stress threshold

  -- pH thresholds
  ph_optimal_min DECIMAL(3,1),
  ph_optimal_max DECIMAL(3,1),

  -- ET-based irrigation parameters (NEW)
  etc_coefficient DECIMAL(3,2), -- Crop coefficient (Kc) for ET₀ × Kc = ETc
  irrigation_efficiency DECIMAL(3,2), -- Typical efficiency for this crop/system
  water_use_efficiency DECIMAL(5,2), -- kg yield per m³ water

  -- Nutrient requirements (for recommendation engine)
  n_requirement_kg_ha DECIMAL(6,2),
  p_requirement_kg_ha DECIMAL(6,2),
  k_requirement_kg_ha DECIMAL(6,2),

  version TEXT DEFAULT '1.0',
  source TEXT, -- 'research', 'local_extension', 'farmer_validated'
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(crop_type, growth_stage, soil_type, version)
);

-- Sample data for common crops
INSERT INTO crop_thresholds (crop_type, growth_stage, soil_type,
  moisture_critical_min, moisture_optimal_min, moisture_optimal_max, moisture_critical_max,
  ec_optimal_min, ec_optimal_max, ec_salinity_threshold,
  temp_optimal_min, temp_optimal_max,
  ph_optimal_min, ph_optimal_max,
  etc_coefficient, irrigation_efficiency) VALUES

  ('maize', 'seedling', NULL, 15, 22, 35, 45, 0.5, 2.0, 4.0, 18, 30, 5.8, 7.0, 0.3, 0.7),
  ('maize', 'vegetative', NULL, 18, 25, 38, 50, 0.8, 2.5, 4.5, 20, 32, 5.8, 7.0, 1.05, 0.75),
  ('maize', 'flowering', NULL, 20, 28, 40, 55, 1.0, 3.0, 5.0, 22, 34, 5.8, 7.0, 1.2, 0.75),

  ('coffee', 'vegetative', NULL, 20, 28, 40, 50, 0.5, 1.5, 3.0, 18, 28, 5.0, 6.5, 0.9, 0.65),
  ('coffee', 'flowering', NULL, 22, 30, 42, 52, 0.6, 1.8, 3.5, 19, 27, 5.0, 6.5, 1.05, 0.65),
  ('coffee', 'fruiting', NULL, 20, 28, 40, 50, 0.7, 2.0, 4.0, 18, 26, 5.0, 6.5, 1.1, 0.7),

  ('beans', 'vegetative', NULL, 18, 25, 38, 48, 0.6, 2.2, 4.5, 18, 28, 6.0, 7.5, 0.85, 0.65),
  ('beans', 'flowering', NULL, 20, 28, 40, 50, 0.7, 2.5, 5.0, 20, 30, 6.0, 7.5, 1.05, 0.7);

-- Weather integration table (NEW)
CREATE TABLE weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location GEOGRAPHY(POINT, 4326),
  farm_id UUID REFERENCES farms(id), -- Optional farm association
  recorded_at TIMESTAMPTZ NOT NULL,

  -- Measurements
  temperature_c DECIMAL(4,1),
  humidity_pct DECIMAL(3,0),
  precipitation_mm DECIMAL(5,1),
  wind_speed_mps DECIMAL(4,1),
  solar_radiation_mjm2 DECIMAL(5,2),
  atmospheric_pressure_hpa DECIMAL(6,1),

  -- Derived metrics
  et0_mm DECIMAL(5,2), -- Reference evapotranspiration (FAO Penman-Monteith)
  growing_degree_days DECIMAL(5,2), -- For phenology modeling

  source TEXT, -- 'weather_station', 'api', 'satellite', 'interpolated'
  source_id TEXT, -- External station ID or API identifier

  UNIQUE(location, recorded_at, source)
);

CREATE INDEX idx_weather_location_time ON weather_data(location, recorded_at DESC);
CREATE INDEX idx_weather_farm_time ON weather_data(farm_id, recorded_at DESC);

-- OCR documents with enhanced confidence tracking
CREATE TABLE ocr_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_type TEXT CHECK (doc_type IN ('soil_lab_report', 'fertilizer_label', 'field_notes', 'receipt', 'other')),
  source TEXT, -- 'mobile_scan', 'upload', 'email'
  file_url TEXT NOT NULL,
  language TEXT DEFAULT 'en',

  -- OCR results
  parsed_text TEXT,
  chemistry_fields JSONB, -- {n, p, k, ca, mg, s, zn, fe, mn, b, cu, mo, om}
  hazards TEXT[], -- Safety warnings from labels
  recommended_rates JSONB, -- Fertilizer application rates per crop

  -- Quality metrics
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  confidence DECIMAL(3,2), -- Overall OCR confidence
  field_confidence JSONB, -- Per-field confidence: {"n": 0.95, "p": 0.87, ...}

  -- Review workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'parsed', 'needs_review', 'validated', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,

  farm_id UUID REFERENCES farms(id),
  field_id UUID REFERENCES fields(id)
);

CREATE INDEX idx_ocr_docs_status ON ocr_documents(status, captured_at DESC);
CREATE INDEX idx_ocr_docs_farm ON ocr_documents(farm_id, captured_at DESC);

-- Model feedback for continuous learning (NEW)
CREATE TABLE model_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  soil_analysis_id UUID REFERENCES soil_analyses(id),
  feedback_type TEXT CHECK (feedback_type IN ('confirmation', 'override', 'correction', 'outcome')),

  -- What was predicted
  predicted_action TEXT,
  predicted_confidence DECIMAL(3,2),
  predicted_parameters JSONB, -- e.g., {"water_amount_mm": 25}

  -- What actually happened
  actual_action TEXT, -- What farmer did
  actual_parameters JSONB,
  actual_outcome TEXT, -- 'crop_improved', 'no_change', 'crop_declined', 'too_early_to_tell'
  outcome_details TEXT,

  -- Context
  user_id UUID REFERENCES users(id),
  farmer_notes TEXT,
  outcome_photos TEXT[], -- URLs to photos showing result

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  outcome_recorded_at TIMESTAMPTZ, -- When outcome was observed
  model_version TEXT,

  -- Data quality flags
  is_reliable BOOLEAN DEFAULT TRUE, -- False if outcome unclear/confounded
  confidence_in_feedback DECIMAL(3,2) -- How confident is the farmer in this feedback
);

CREATE INDEX idx_feedback_analysis ON model_feedback(soil_analysis_id);
CREATE INDEX idx_feedback_model_version ON model_feedback(model_version, created_at);
CREATE INDEX idx_feedback_reliable ON model_feedback(is_reliable) WHERE is_reliable = TRUE;

-- Recommendation actions library (NEW)
CREATE TABLE recommendation_actions (
  code TEXT PRIMARY KEY,
  category TEXT CHECK (category IN ('irrigation', 'fertilization', 'soil_management', 'pest_disease', 'monitoring')),
  title TEXT NOT NULL,
  description TEXT,
  priority_weight DECIMAL(3,2) DEFAULT 0.5, -- For multi-issue prioritization (0-1)

  -- Cost-benefit templates
  typical_cost_usd_ha DECIMAL(8,2),
  typical_benefit_usd_ha DECIMAL(8,2),
  labor_hours_ha DECIMAL(4,1),
  material_costs JSONB, -- {"water": 0.0002, "fertilizer": 1.5}

  -- Implementation guidance
  timing_guidance JSONB, -- {"best_time_of_day": "early_morning", "avoid_conditions": ["rain", "high_wind"]}
  equipment_needed TEXT[],
  prerequisites TEXT[], -- ["soil_test_recent", "irrigation_system_functional"]

  -- Constraints
  min_temperature_c DECIMAL(4,1),
  max_temperature_c DECIMAL(4,1),
  avoid_growth_stages TEXT[], -- Stages where this action is not recommended

  version TEXT DEFAULT '1.0',
  active BOOLEAN DEFAULT TRUE
);

-- Sample recommendation actions
INSERT INTO recommendation_actions (code, category, title, description, priority_weight,
  typical_cost_usd_ha, typical_benefit_usd_ha, labor_hours_ha, timing_guidance, equipment_needed) VALUES

  ('irrigate_light', 'irrigation', 'Light Irrigation',
   'Apply 10-15mm of water to maintain moisture levels', 0.6,
   30, 120, 1.5,
   '{"best_time_of_day": "early_morning", "avoid_conditions": ["rain_forecast_24h", "temperature_above_35"]}'::jsonb,
   ARRAY['irrigation_system', 'water_source']),

  ('irrigate_moderate', 'irrigation', 'Moderate Irrigation',
   'Apply 20-30mm of water to address moisture deficit', 0.8,
   50, 200, 2.0,
   '{"best_time_of_day": "early_morning", "avoid_conditions": ["rain_forecast_24h"]}'::jsonb,
   ARRAY['irrigation_system', 'water_source']),

  ('irrigate_heavy', 'irrigation', 'Heavy Irrigation',
   'Apply 35-50mm of water to address severe moisture deficit', 1.0,
   80, 300, 3.5,
   '{"best_time_of_day": "early_morning", "latest_start": "10am", "avoid_conditions": ["rain_forecast_48h", "waterlogging_risk"]}'::jsonb,
   ARRAY['irrigation_system', 'water_source']),

  ('fertilize_nitrogen', 'fertilization', 'Nitrogen Application',
   'Apply nitrogen fertilizer to address deficiency', 0.7,
   60, 250, 2.0,
   '{"best_time": "before_rain", "avoid_conditions": ["heavy_rain_forecast", "flowering_stage"]}'::jsonb,
   ARRAY['spreader', 'fertilizer']),

  ('mulch_organic', 'soil_management', 'Apply Organic Mulch',
   'Add organic mulch layer to conserve moisture and suppress weeds', 0.5,
   45, 150, 4.0,
   '{"best_season": "dry_season_start", "avoid_conditions": ["wet_soil"]}'::jsonb,
   ARRAY['mulch_material', 'labor']),

  ('monitor_daily', 'monitoring', 'Increase Monitoring Frequency',
   'Check soil and crop conditions daily for 1-2 weeks', 0.3,
   0, 50, 0.5,
   '{"frequency": "daily", "duration_days": 14}'::jsonb,
   ARRAY[]);
```

---

## 2) Recommendation Output Schema

The structured JSON format for recommendations:

```json
{
  "primary_action": {
    "code": "irrigate_moderate",
    "title": "Irrigate Field",
    "category": "irrigation",
    "priority": "high",
    "urgency_score": 0.85,
    "confidence": 0.78,

    "details": {
      "water_amount_mm": 25,
      "water_amount_liters": 250000,
      "water_amount_liters_ha": 250000,
      "duration_hours": 3.5,
      "method": "drip",
      "application_rate_mm_hr": 7.1,

      "timing": {
        "recommended_start": "2024-11-05T06:00:00Z",
        "latest_start": "2024-11-05T18:00:00Z",
        "duration_hours": 3.5,
        "avoid_if": [
          "rainfall > 5mm forecasted in next 24h",
          "air_temperature > 35°C",
          "high_wind_speed > 20km/h (for sprinkler systems)"
        ],
        "best_conditions": "Early morning (6-9 AM), calm wind, moderate temperature"
      },

      "reasoning": {
        "triggers": [
          "Soil moisture at 15.2% VWC (below optimal 22-28% for maize vegetative stage)",
          "Moisture declined 8% in past 48 hours",
          "No significant rainfall in past 7 days",
          "High ET₀ (6.2mm/day) increasing water demand",
          "Crop entering critical growth stage"
        ],
        "feature_importances": {
          "moisture_deficit": 0.45,
          "moisture_trend_48h": 0.20,
          "days_since_rain": 0.15,
          "crop_growth_stage": 0.12,
          "et0_rate": 0.08
        },
        "thresholds_hit": [
          "moisture < optimal_min (22%)",
          "moisture_trend_48h < -5%"
        ]
      }
    },

    "cost_benefit": {
      "estimated_cost_usd": 45.50,
      "cost_breakdown": {
        "water": 5.00,
        "electricity_fuel": 15.50,
        "labor": 25.00
      },
      "estimated_benefit_usd": 185.00,
      "benefit_explanation": "Prevents yield loss from water stress (~15% yield protection)",
      "roi": 4.1,
      "labor_hours": 2.5,
      "payback_period_days": 45
    },

    "implementation_steps": [
      "Check irrigation system functionality",
      "Verify water source availability (250,000 L needed)",
      "Start irrigation at 6:00 AM",
      "Monitor soil moisture after 24 hours",
      "Adjust timing if rainfall occurs"
    ],

    "alternatives": [
      {
        "code": "irrigate_light",
        "title": "Light Irrigation (15mm)",
        "pros": ["Lower cost ($28)", "Faster (2 hours)"],
        "cons": ["May not fully address deficit", "Might need repeat in 3-4 days"],
        "cost_usd": 28
      }
    ]
  },

  "secondary_actions": [
    {
      "code": "monitor_daily",
      "title": "Increase Monitoring Frequency",
      "priority": "medium",
      "urgency_score": 0.55,
      "details": {
        "check_interval_hours": 24,
        "duration_days": 7,
        "metrics_to_watch": [
          "soil_moisture_trend",
          "plant_stress_signs",
          "leaf_color_changes"
        ],
        "alert_if": [
          "moisture drops below 12%",
          "visible wilting observed"
        ]
      }
    },
    {
      "code": "mulch_organic",
      "title": "Apply Organic Mulch",
      "priority": "low",
      "urgency_score": 0.35,
      "details": {
        "material": "crop_residue or grass clippings",
        "thickness_cm": 5,
        "coverage_area_m2": 10000,
        "long_term_benefit": "Reduces water loss by 25-30%, improves soil structure"
      },
      "cost_benefit": {
        "estimated_cost_usd": 45,
        "estimated_benefit_usd": 120,
        "roi": 2.7,
        "payback_period_days": 90
      }
    }
  ],

  "alerts": [
    {
      "severity": "warning",
      "code": "water_stress_developing",
      "message": "Soil moisture trending below optimal range for maize vegetative stage",
      "triggered_at": "2024-11-04T14:23:00Z",
      "threshold_hit": "moisture < 18% for 48 consecutive hours",
      "impact": "Potential 10-15% yield reduction if not addressed within 48 hours",
      "suggested_action": "irrigate_moderate"
    }
  ],

  "forecast": {
    "moisture_72h": [
      {"time": "2024-11-05T00:00:00Z", "predicted_moisture": 14.8, "confidence": 0.85},
      {"time": "2024-11-05T24:00:00Z", "predicted_moisture": 13.9, "confidence": 0.78},
      {"time": "2024-11-06T48:00:00Z", "predicted_moisture": 12.5, "confidence": 0.65}
    ],
    "without_action_impact": "Moisture will drop to critical levels (12.5%) within 48 hours",
    "with_action_impact": "Moisture will stabilize at 25-28% (optimal range)"
  },

  "metadata": {
    "generated_at": "2024-11-04T15:00:00Z",
    "model_version": "v2.1.0",
    "confidence_method": "ensemble_voting",
    "models_used": ["heuristic_rules", "lstm_forecast", "gradient_boost_classifier"]
  }
}
```

This schema provides:
- **Actionable details** with specific amounts, timing, and steps
- **Transparent reasoning** showing what triggered the recommendation
- **Cost-benefit analysis** to help prioritize
- **Alternatives** for different resource constraints
- **Forecasting** to show consequences of action vs. inaction

---

See Part 2 for multi-sensor fusion algorithms and time-series feature engineering.
See Part 3 for ML models, API contracts, and operational workflows.
