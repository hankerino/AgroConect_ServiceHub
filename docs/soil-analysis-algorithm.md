# Soil Analysis Algorithm Blueprint

This document outlines an actionable algorithm design derived from the provided project plan. It emphasizes data flows, validation, modeling approaches, and integration points with the existing Soil Analysis platform (e.g., `SoilAnalysis` table with `created_date`, `location`, `status`).

## 1) Document & Sensor Landscape Review
- **Inputs**: Soil sensor specs (moisture, EC, temperature, pH), agronomic KPI definitions, existing Supabase schema and Soil Analysis UI flow, scanner component for OCR ingestion.
- **Mapping**: Align each KPI and sensor attribute to database fields. Suggested base tables (Supabase):
  - `soil_analyses` (`id` UUID PK, `location` GEOGRAPHY, `created_at`, `status`, `sensor_packet_id`, `ocr_doc_id`, `moisture`, `ec`, `temperature`, `ph`, `nutrient_proxy_score`, `recommendation`, `confidence`, `explanations` JSONB).
  - `sensor_packets` (`id`, `sensor_id`, `farm_id`, `payload_type`, `payload` JSONB, `collected_at`, `transmitted_at`, `status`, `validation_flags` JSONB, `calibration_version`).
  - `ocr_documents` (`id`, `doc_type`, `source`, `file_url`, `language`, `parsed_text`, `chemistry_fields` JSONB, `captured_at`, `confidence`, `status`).
- **OCR catalogue**: Enumerate expected documents (soil lab PDFs, fertilizer labels, field notes). Map them to scanner ingestion types with metadata fields: `doc_type`, `source`, `captured_at`, `language`, `parsed_text`, `bounding_boxes`, `chemistry_fields` (e.g., N-P-K, micronutrients).

## 2) Data Ingestion & Validation Design
### 2.1 Sensor packet schemas
- **Packet envelope**: `{ sensor_id, hardware_version, farm_id, location: {lat, lon, block_id}, collected_at, transmitted_at, reading_type, payload }`.
- **Payload variants**:
  - Moisture: `{ volumetric_water_content, temperature, battery, signal_strength }`
  - EC: `{ electrical_conductivity, soil_temp, calibration_version }`
  - Temperature: `{ soil_temp, air_temp, humidity }`
  - pH: `{ ph, temperature, calibration_version }`

### 2.2 OCR metadata schema
- `{ doc_id, doc_type, source, captured_at, language, page_count, checksum, text_excerpt, chemistry_fields: {n, p, k, ca, mg, s, zn, fe, mn, b}, hazards, recommended_rates, confidence }`.

### 2.3 Validation rules
- **Range checks**: moisture (0–60% VWC), EC (0–10 dS/m), temp (-10 to 60°C), pH (3.5–9.5). Flag out-of-range packets with `status = "invalid"` and retain raw payload.
- **Calibration offsets**: apply sensor-specific offsets from calibration table keyed by `sensor_id` & `calibration_version`.
- **Sampling frequency**: enforce min/max intervals (e.g., ≥10 minutes) to detect dropouts (`sampling_gap` feature) and bursts (`rapid_sampling_flag`).
- **Geospatial sanity**: verify location within farm boundary polygons; flag `location_mismatch` if outside.
- **OCR confidence**: reject or route to manual review when OCR confidence < threshold (e.g., 0.7) or missing chemistry fields for fertilizer labels.

**Validation pseudocode sketch (service worker or edge function):**
1. Fetch calibration offsets for `sensor_id` and apply to raw payload.
2. Evaluate range + geospatial + cadence rules; populate `validation_flags` array (e.g., `"out_of_range"`, `"sampling_gap"`).
3. If any hard-fail flags, mark packet `status = 'invalid'`; else `status = 'valid'` and emit derived features (e.g., `sampling_gap_minutes`).
4. Persist packet + flags + derived features; enqueue downstream model job when `status = 'valid'`.

### 2.4 Synthetic data backlog
- Generate sensor time series with controlled noise for moisture, EC, temp, and pH, including drift and dropout patterns.
- Create OCR mock documents with known nutrient compositions to validate parsing and normalization.

### 2.5 Data flow (happy path)
1. Sensor sends packet ➜ ingestion API validates + normalizes ➜ stores in `sensor_packets`.
2. OCR doc uploaded ➜ scanner extracts text + chemistry ➜ stores in `ocr_documents` with confidence.
3. Feature builder joins validated packets + OCR features ➜ writes summary to `soil_analyses`.
4. Heuristic alerts fire immediately; batch model jobs refresh recommendations on schedule.

## 3) Modeling Approach Selection
- **Targets**:
  - Soil moisture estimation and short-term forecast.
  - Nutrient status proxy from EC + OCR fertilizer composition.
  - Irrigation/fertilization recommendations.
- **Model families**:
  - **Heuristics (tier a)**: rule-based thresholds for immediate alerts (e.g., moisture < crop-specific threshold triggers irrigation alert; EC > salinity threshold warns of salt stress).
  - **ML models (tier b)**: sequence models or gradient boosting over engineered features for batch scoring; retrieval-augmented lookups to merge OCR text with sensor signals.
- **Architecture**: Two-tier pipeline where heuristics serve low-latency alerts; ML models run periodically (e.g., hourly) to refresh `SoilAnalysis` recommendations and `confidence` scores.

## 4) Feature Engineering & Labeling
- **Derived features**: rolling moisture deltas (1h/6h/24h), diurnal temperature range, rainfall-adjusted moisture baseline (using external precip feed), EC trend slope, sensor health (drift estimate, dropout rate), OCR nutrient vectors normalized to agronomic standards, nutrient balance ratios (N:P:K).
- **Labeling strategy**: link historical outcomes (yield, disease incidence) and expert annotations to form soil-condition classes (e.g., `adequate_moisture`, `water_deficit`, `salinity_risk`, `nutrient_deficit`). Maintain ontology with definitions and thresholds to keep outputs interpretable.
  - Keep label provenance (farmer confirmation vs. agronomist annotation) to weight samples differently during training.
  - Store ontology in `soil_condition_ontology` table with `code`, `description`, `thresholds`, `version` for reproducibility.

## 5) Model Evaluation & MLOps
- **Metrics**: RMSE/MAE for moisture/temperature forecasts, F1 for condition classification, lead-time for alerting, calibration curves for recommendation confidence.
- **Feedback loop**: Capture user confirmations/overrides from Soil Analysis UI; log them to a `model_feedback` table keyed by `soil_analysis_id` to drive monitoring and retraining triggers.
- **Monitoring**: data quality dashboards (latency, missingness, range violations), model drift checks (feature distribution shifts), and alerting when confidence degrades.
  - Add canary scoring set per release to detect major regression before full rollout.

## 6) System Integration
- **API contracts**:
  - **POST /api/sensor-readings**: accepts packet envelope, returns normalized record ID and validation status.
  - **POST /api/ocr-documents**: accepts scanned doc metadata + file reference, returns parsed chemistry fields and confidence.
  - **GET /api/soil-analyses/:id**: returns consolidated record including sensor aggregates, OCR findings, recommendations, and confidence.
- **UI hooks**: status badges (`valid`, `invalid`, `needs_review`), confidence indicators, and “View Report” drill-down showing model explanations (feature importances, threshold hits) alongside OCR artifacts.

**API payload sketch (sensor readings)**
```json
{
  "sensor_id": "abc-123",
  "hardware_version": "1.2.0",
  "farm_id": "farm-001",
  "location": {"lat": -1.94, "lon": 30.12, "block_id": "plot-7"},
  "collected_at": "2024-11-04T10:14:00Z",
  "transmitted_at": "2024-11-04T10:14:08Z",
  "reading_type": "moisture",
  "payload": {"volumetric_water_content": 0.23, "temperature": 22.4, "battery": 0.81, "signal_strength": -72}
}
```

**State transitions**
- `pending` ➜ `valid` after validation passes.
- `pending` ➜ `invalid` when hard-fail flags exist; keep raw data + reasons.
- `valid` ➜ `scored` after heuristic/model outputs are written to `soil_analyses`.

## 7) Risk, Governance, and Rollout
- **Calibration & compliance**: document sensor calibration cadence, fertilizer labeling regulations, and data residency constraints (Supabase region mapping).
- **Rollout stages**: sandbox with synthetic data, controlled pilot (few farms), phased scale-out with observability on latency, data quality, and model drift.

## 8) Next Steps (actionable backlog)
1. Finalize sensor packet and OCR schemas in Supabase (DDL + JSON schema validators) plus migration scripts.
2. Implement ingestion validation service with range, frequency, and geospatial checks; wire synthetic data generators for CI.
3. Ship heuristic alert rules per crop type; instrument them for feedback capture in UI with event names aligned to `model_feedback` schema.
4. Prototype batch ML model (gradient boosting over engineered features) and set up scheduled retraining using captured feedback.
5. Add API stubs and UI status badges/confidence indicators aligned with `/api/soil-analyses` responses.
6. Define canary scoring set + acceptance thresholds before promoting new models to production.
