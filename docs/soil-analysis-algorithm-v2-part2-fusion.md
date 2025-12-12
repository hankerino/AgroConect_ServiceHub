# Soil Analysis Algorithm v2.0 - Part 2: Multi-Sensor Fusion & Time-Series

## 3) Multi-Sensor Fusion Strategy

When multiple sensors exist in one location, conflicting readings must be reconciled intelligently.

### 3.1 Fusion Methods

```python
from typing import List, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
import numpy as np
from scipy.spatial.distance import cdist

@dataclass
class SensorPacket:
    id: str
    sensor_id: str
    location: tuple[float, float]  # (lat, lon)
    collected_at: datetime
    reading_type: str
    value: float
    battery_level: float
    signal_strength_dbm: int
    sensor_health_score: float
    age_minutes: float

@dataclass
class FusedReading:
    value: float
    confidence: float
    method: str
    sensor_count: int
    agreement_score: float = None
    outlier_count: int = 0
    coverage_area_m2: float = None
    flags: List[str] = None

class MultiSensorFusion:
    """
    Intelligent fusion of readings from multiple sensors.
    """

    def __init__(self, method: str = 'weighted_avg'):
        self.method = method
        self.expected_variance = {
            'moisture': 3.0,  # %VWC
            'ec': 0.5,  # dS/m
            'temperature': 2.0,  # °C
            'ph': 0.3
        }

    def fuse(self, packets: List[SensorPacket]) -> FusedReading:
        """
        Main fusion method dispatcher.
        """
        if len(packets) == 0:
            return None
        if len(packets) == 1:
            return FusedReading(
                value=packets[0].value,
                confidence=packets[0].sensor_health_score,
                method='single_sensor',
                sensor_count=1
            )

        if self.method == 'weighted_avg':
            return self._weighted_average_fusion(packets)
        elif self.method == 'spatial_interpolation':
            return self._spatial_interpolation_fusion(packets)
        elif self.method == 'consensus':
            return self._consensus_fusion(packets)
        elif self.method == 'bayesian':
            return self._bayesian_fusion(packets)
        else:
            raise ValueError(f"Unknown fusion method: {self.method}")

    def _weighted_average_fusion(self, packets: List[SensorPacket]) -> FusedReading:
        """
        Weight sensors by health, recency, and signal strength.

        Weighting formula:
        w = (health_score^2) × (recency_weight) × (signal_weight) × (proximity_weight)
        """
        weights = []

        for p in packets:
            # Health weight (squared to penalize degraded sensors more)
            health_weight = p.sensor_health_score ** 2

            # Recency weight (exponential decay over 1 hour)
            recency_weight = np.exp(-p.age_minutes / 60)

            # Signal strength weight (normalized to 0-1)
            # Typical range: -120 (poor) to -30 (excellent)
            signal_normalized = (p.signal_strength_dbm + 120) / 90
            signal_weight = np.clip(signal_normalized, 0.1, 1.0)

            # Battery weight (minimal influence unless very low)
            battery_weight = 0.5 + 0.5 * p.battery_level  # Range: 0.5-1.0

            # Combined weight
            total_weight = (
                health_weight * 0.40 +
                recency_weight * 0.30 +
                signal_weight * 0.20 +
                battery_weight * 0.10
            )
            weights.append(total_weight)

        # Normalize weights
        weights = np.array(weights)
        weights = weights / weights.sum()

        # Weighted average
        values = np.array([p.value for p in packets])
        fused_value = np.sum(values * weights)

        # Confidence based on sensor agreement
        std_dev = np.std(values)
        expected_std = self.expected_variance.get(packets[0].reading_type, 1.0)
        agreement_score = 1.0 - min(std_dev / expected_std, 1.0)

        # Final confidence combines agreement and average sensor health
        avg_health = np.mean([p.sensor_health_score for p in packets])
        confidence = 0.6 * agreement_score + 0.4 * avg_health

        return FusedReading(
            value=fused_value,
            confidence=confidence,
            method='weighted_avg',
            sensor_count=len(packets),
            agreement_score=agreement_score
        )

    def _consensus_fusion(self, packets: List[SensorPacket]) -> FusedReading:
        """
        Remove outliers using modified z-score, then average remaining.

        Good for detecting and excluding failed sensors.
        """
        values = np.array([p.value for p in packets])

        # Calculate modified z-score (more robust to outliers than standard z-score)
        median = np.median(values)
        mad = np.median(np.abs(values - median))  # Median Absolute Deviation

        if mad == 0:
            # All values identical or nearly so - perfect agreement
            return FusedReading(
                value=median,
                confidence=0.95,
                method='consensus',
                sensor_count=len(packets),
                agreement_score=1.0,
                outlier_count=0
            )

        # Modified z-scores
        modified_z_scores = 0.6745 * (values - median) / mad

        # Identify outliers (threshold: 3.5 for modified z-score)
        inlier_mask = np.abs(modified_z_scores) < 3.5
        inliers = [p for p, is_inlier in zip(packets, inlier_mask) if is_inlier]
        outlier_count = len(packets) - len(inliers)

        # Check if too many outliers (indicates poor spatial homogeneity or sensor failures)
        if len(inliers) < len(packets) * 0.5:
            # Less than 50% agreement - flag for manual review
            flags = ['high_disagreement', f'{outlier_count}_outliers']
            confidence = 0.3
        else:
            flags = []
            confidence = len(inliers) / len(packets)

        # Average inliers
        if len(inliers) > 0:
            inlier_values = [p.value for p in inliers]
            fused_value = np.mean(inlier_values)
            agreement_score = 1.0 - (np.std(inlier_values) / self.expected_variance.get(packets[0].reading_type, 1.0))
        else:
            # Fallback to median if all outliers
            fused_value = median
            agreement_score = 0.0

        return FusedReading(
            value=fused_value,
            confidence=confidence,
            method='consensus',
            sensor_count=len(inliers),
            agreement_score=max(agreement_score, 0.0),
            outlier_count=outlier_count,
            flags=flags if flags else None
        )

    def _spatial_interpolation_fusion(self, packets: List[SensorPacket]) -> FusedReading:
        """
        Inverse Distance Weighting (IDW) for spatially distributed sensors.

        Use this when sensors cover a larger field area.
        """
        # Calculate field centroid
        lats = [p.location[0] for p in packets]
        lons = [p.location[1] for p in packets]
        target_location = (np.mean(lats), np.mean(lons))

        # Calculate distances from each sensor to centroid
        distances = []
        for p in packets:
            # Haversine distance in meters
            dist = self._haversine_distance(p.location, target_location)
            distances.append(dist)

        distances = np.array(distances)

        # IDW with power=2, minimum distance 1m to avoid division by zero
        weights = 1.0 / np.maximum(distances ** 2, 1.0)
        weights = weights / weights.sum()

        # Weighted interpolation
        values = np.array([p.value for p in packets])
        fused_value = np.sum(values * weights)

        # Confidence decreases with spatial variance
        spatial_variance = np.var(values)
        expected_variance = self.expected_variance.get(packets[0].reading_type, 1.0) ** 2
        confidence = 1.0 - min(spatial_variance / expected_variance, 1.0)

        # Coverage area (convex hull)
        coverage_area = self._calculate_coverage_area(packets)

        return FusedReading(
            value=fused_value,
            confidence=confidence,
            method='spatial_interpolation',
            sensor_count=len(packets),
            coverage_area_m2=coverage_area
        )

    def _bayesian_fusion(self, packets: List[SensorPacket]) -> FusedReading:
        """
        Bayesian sensor fusion accounting for sensor-specific uncertainties.

        Each sensor's measurement is treated as a Gaussian with mean=value
        and variance based on sensor health.
        """
        # Extract values and estimate uncertainties
        values = np.array([p.value for p in packets])

        # Uncertainty inversely proportional to sensor health
        # Better sensors have lower variance
        base_variance = self.expected_variance.get(packets[0].reading_type, 1.0) ** 2
        variances = base_variance / np.array([max(p.sensor_health_score, 0.1) for p in packets])

        # Bayesian fusion: posterior is product of Gaussians
        # Result is also Gaussian with:
        # precision (1/variance) = sum of precisions
        # mean = weighted sum where weights are precisions

        precisions = 1.0 / variances
        total_precision = np.sum(precisions)

        fused_value = np.sum(values * precisions) / total_precision
        fused_variance = 1.0 / total_precision
        fused_std = np.sqrt(fused_variance)

        # Confidence based on reduction in uncertainty
        confidence = 1.0 - min(fused_std / np.sqrt(base_variance), 1.0)

        return FusedReading(
            value=fused_value,
            confidence=confidence,
            method='bayesian',
            sensor_count=len(packets),
            agreement_score=confidence
        )

    @staticmethod
    def _haversine_distance(loc1: tuple, loc2: tuple) -> float:
        """
        Calculate distance between two lat/lon points in meters.
        """
        lat1, lon1 = loc1
        lat2, lon2 = loc2

        R = 6371000  # Earth radius in meters
        phi1, phi2 = np.radians(lat1), np.radians(lat2)
        dphi = np.radians(lat2 - lat1)
        dlambda = np.radians(lon2 - lon1)

        a = np.sin(dphi/2)**2 + np.cos(phi1) * np.cos(phi2) * np.sin(dlambda/2)**2
        c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))

        return R * c

    @staticmethod
    def _calculate_coverage_area(packets: List[SensorPacket]) -> float:
        """
        Estimate field coverage area using convex hull of sensor locations.
        """
        if len(packets) < 3:
            return 0.0

        # Simplified: approximate as circle with radius = max distance from centroid
        lats = [p.location[0] for p in packets]
        lons = [p.location[1] for p in packets]
        centroid = (np.mean(lats), np.mean(lons))

        max_dist = 0
        for p in packets:
            dist = MultiSensorFusion._haversine_distance(p.location, centroid)
            max_dist = max(max_dist, dist)

        # Area = π r²
        return np.pi * (max_dist ** 2)


def select_fusion_method(packets: List[SensorPacket],
                         field_area_ha: float) -> str:
    """
    Automatically select best fusion method based on sensor distribution.
    """
    if len(packets) == 1:
        return 'single_sensor'

    # Calculate spatial distribution
    lats = [p.location[0] for p in packets]
    lons = [p.location[1] for p in packets]

    # If sensors are very close (< 10m apart), use weighted average
    max_separation = 0
    for i in range(len(packets)):
        for j in range(i+1, len(packets)):
            dist = MultiSensorFusion._haversine_distance(
                packets[i].location,
                packets[j].location
            )
            max_separation = max(max_separation, dist)

    if max_separation < 10:
        # Clustered sensors - use weighted average or consensus
        health_variance = np.var([p.sensor_health_score for p in packets])
        if health_variance > 0.1:
            return 'consensus'  # Remove likely failed sensors
        else:
            return 'weighted_avg'

    elif max_separation < 100:
        # Moderate spacing - use spatial interpolation
        return 'spatial_interpolation'

    else:
        # Widely distributed - bayesian fusion accounting for uncertainties
        return 'bayesian'
```

---

## 4) Advanced Time-Series Feature Engineering

### 4.1 Handling Irregular Sampling

```python
from datetime import datetime, timedelta
from typing import List, Optional
import numpy as np
from dataclasses import dataclass

@dataclass
class ResampledPoint:
    time: datetime
    value: Optional[float]
    is_interpolated: bool = False
    is_missing: bool = False
    gap_size_minutes: float = 0

class TimeSeriesFeatureBuilder:
    """
    Build robust time-series features from irregularly sampled sensor data.
    """

    def __init__(self, sensor_id: str, target_metric: str):
        self.sensor_id = sensor_id
        self.target_metric = target_metric

    def build_features(self,
                       current_reading: float,
                       current_time: datetime,
                       historical_window_hours: int = 168) -> dict:
        """
        Generate comprehensive time-series features.
        """
        # Fetch historical readings
        history = self.fetch_history(
            sensor_id=self.sensor_id,
            end_time=current_time,
            window_hours=historical_window_hours
        )

        if len(history) == 0:
            return self._cold_start_features(current_reading)

        # Resample to regular 30-minute intervals
        resampled = self.resample_irregular_series(
            readings=history,
            target_interval_minutes=30,
            max_gap_fill_hours=6
        )

        features = {}

        # 1. Rolling statistics over multiple windows
        for window_hours in [1, 6, 24, 72, 168]:
            window_data = self._get_window_data(resampled, window_hours)

            if len(window_data) >= 2:
                prefix = f"{self.target_metric}_{window_hours}h"

                features[f"{prefix}_mean"] = np.mean(window_data)
                features[f"{prefix}_std"] = np.std(window_data)
                features[f"{prefix}_min"] = np.min(window_data)
                features[f"{prefix}_max"] = np.max(window_data)
                features[f"{prefix}_range"] = np.max(window_data) - np.min(window_data)

                # Delta from window start
                features[f"{prefix}_delta"] = current_reading - window_data[0]

                # Trend (linear regression slope)
                features[f"{prefix}_trend"] = self._calculate_trend(window_data)

                # Volatility (coefficient of variation)
                mean_val = np.mean(window_data)
                if mean_val != 0:
                    features[f"{prefix}_cv"] = np.std(window_data) / abs(mean_val)

        # 2. Diurnal patterns
        hourly_profile = self.calculate_hourly_profile(resampled, days=7)
        current_hour = current_time.hour
        features[f"{self.target_metric}_vs_hourly_baseline"] = \
            current_reading - hourly_profile[current_hour]
        features[f"{self.target_metric}_hourly_baseline"] = hourly_profile[current_hour]

        # Diurnal range (max - min in typical day)
        features[f"{self.target_metric}_diurnal_range"] = \
            max(hourly_profile.values()) - min(hourly_profile.values())

        # 3. Gap and sampling quality metrics
        gaps = self.identify_gaps(history, expected_interval_minutes=30)
        features["sampling_gap_count_24h"] = len([g for g in gaps if g.duration_hours <= 24])
        features["sampling_gap_count_7d"] = len(gaps)
        features["longest_gap_hours_7d"] = max([g.duration_hours for g in gaps]) if gaps else 0
        features["sampling_completeness_24h"] = self._calculate_completeness(history, window_hours=24)
        features["sampling_completeness_7d"] = self._calculate_completeness(history, window_hours=168)

        # 4. Seasonal baseline adjustment
        if historical_window_hours >= 168:  # At least 1 week
            day_of_year = current_time.timetuple().tm_yday
            seasonal_baseline = self.calculate_seasonal_baseline(history, day_of_year)
            features[f"{self.target_metric}_vs_seasonal"] = current_reading - seasonal_baseline

        # 5. Rate of change (derivatives at multiple scales)
        if len(history) >= 2:
            # Instantaneous rate (last 2 readings)
            time_diff_hours = (history[-1].time - history[-2].time).seconds / 3600
            features[f"{self.target_metric}_rate_instant"] = \
                (history[-1].value - history[-2].value) / time_diff_hours

            # Average rates over windows
            for window_hours in [3, 12, 48]:
                window_data = self._get_window_data(resampled, window_hours)
                if len(window_data) >= 2:
                    avg_rate = (current_reading - window_data[0]) / window_hours
                    features[f"{self.target_metric}_rate_{window_hours}h"] = avg_rate

        # 6. Percentile ranking (where does current value sit in distribution?)
        all_values = [p.value for p in resampled if p.value is not None]
        if len(all_values) > 10:
            percentile = (np.sum(all_values < current_reading) / len(all_values)) * 100
            features[f"{self.target_metric}_percentile_7d"] = percentile

        # 7. Autocorrelation features (are there cyclic patterns?)
        if len(all_values) >= 48:  # Need at least 24 hours of data
            lag_24h = self._calculate_autocorrelation(all_values, lag=48)  # 48 30-min intervals = 24h
            features[f"{self.target_metric}_autocorr_24h"] = lag_24h

        # 8. Threshold crossings (how many times crossed certain levels?)
        thresholds = self._get_thresholds(self.target_metric)
        for level, threshold_value in thresholds.items():
            crossing_count = self._count_threshold_crossings(resampled, threshold_value)
            features[f"{self.target_metric}_crossings_{level}_7d"] = crossing_count

        return features

    def resample_irregular_series(self,
                                   readings: List[tuple],
                                   target_interval_minutes: int,
                                   max_gap_fill_hours: int) -> List[ResampledPoint]:
        """
        Convert irregular time series to regular intervals with intelligent gap handling.

        Strategy:
        - Forward-fill values within max_gap_fill window
        - Mark larger gaps as missing rather than interpolating
        - Track which points are interpolated vs. measured
        """
        if not readings:
            return []

        readings = sorted(readings, key=lambda x: x[0])  # Sort by time
        start_time = readings[0][0]
        end_time = readings[-1][0]

        # Generate regular time grid
        time_grid = []
        current = start_time
        while current <= end_time:
            time_grid.append(current)
            current += timedelta(minutes=target_interval_minutes)

        resampled = []
        reading_idx = 0
        last_valid_value = None
        last_valid_time = None

        for grid_time in time_grid:
            # Find closest reading
            closest_reading = None
            min_distance = timedelta(hours=max_gap_fill_hours)

            # Look for readings near this grid point
            while reading_idx < len(readings):
                reading_time, reading_value = readings[reading_idx]
                distance = abs(reading_time - grid_time)

                if distance < min_distance:
                    min_distance = distance
                    closest_reading = (reading_time, reading_value)

                # Move forward if we've passed this grid point
                if reading_time > grid_time + min_distance:
                    break

                reading_idx += 1

            # Decide how to fill this grid point
            if closest_reading and min_distance <= timedelta(minutes=target_interval_minutes):
                # Direct measurement (or very close)
                resampled.append(ResampledPoint(
                    time=grid_time,
                    value=closest_reading[1],
                    is_interpolated=False,
                    gap_size_minutes=min_distance.seconds / 60
                ))
                last_valid_value = closest_reading[1]
                last_valid_time = grid_time

            elif last_valid_value and \
                 (grid_time - last_valid_time) <= timedelta(hours=max_gap_fill_hours):
                # Forward-fill within max_gap window
                resampled.append(ResampledPoint(
                    time=grid_time,
                    value=last_valid_value,
                    is_interpolated=True,
                    gap_size_minutes=(grid_time - last_valid_time).seconds / 60
                ))

            else:
                # Gap too large - mark as missing
                resampled.append(ResampledPoint(
                    time=grid_time,
                    value=None,
                    is_missing=True
                ))

        return resampled

    def calculate_hourly_profile(self, resampled: List[ResampledPoint], days: int = 7) -> dict:
        """
        Calculate typical value for each hour of day (0-23).

        Useful for detecting deviations from normal diurnal patterns.
        """
        hourly_buckets = {hour: [] for hour in range(24)}

        for point in resampled:
            if point.value is not None and not point.is_missing:
                hour = point.time.hour
                hourly_buckets[hour].append(point.value)

        # Median for each hour (robust to outliers)
        hourly_profile = {}
        for hour in range(24):
            if len(hourly_buckets[hour]) > 0:
                hourly_profile[hour] = np.median(hourly_buckets[hour])
            else:
                # Interpolate from neighboring hours
                hourly_profile[hour] = self._interpolate_missing_hour(hourly_profile, hour)

        return hourly_profile

    def identify_gaps(self, readings: List[tuple], expected_interval_minutes: int) -> List:
        """
        Identify periods of missing data.
        """
        @dataclass
        class Gap:
            start_time: datetime
            end_time: datetime
            duration_hours: float

        gaps = []
        for i in range(len(readings) - 1):
            time_diff = (readings[i+1][0] - readings[i][0]).seconds / 60

            if time_diff > expected_interval_minutes * 2:  # More than 2× expected
                gaps.append(Gap(
                    start_time=readings[i][0],
                    end_time=readings[i+1][0],
                    duration_hours=time_diff / 60
                ))

        return gaps

    def _calculate_trend(self, values: List[float]) -> float:
        """
        Calculate linear trend (slope) using least squares.
        """
        n = len(values)
        if n < 2:
            return 0.0

        x = np.arange(n)
        slope = (n * np.sum(x * values) - np.sum(x) * np.sum(values)) / \
                (n * np.sum(x**2) - np.sum(x)**2)

        return slope

    def _calculate_autocorrelation(self, values: List[float], lag: int) -> float:
        """
        Calculate autocorrelation at given lag.
        """
        n = len(values)
        if n < lag + 10:
            return 0.0

        values = np.array(values)
        mean = np.mean(values)

        c0 = np.sum((values - mean) ** 2) / n
        c_lag = np.sum((values[:-lag] - mean) * (values[lag:] - mean)) / n

        return c_lag / c0 if c0 != 0 else 0.0

    def _count_threshold_crossings(self, resampled: List[ResampledPoint], threshold: float) -> int:
        """
        Count how many times the series crosses a threshold.
        """
        crossings = 0
        was_above = None

        for point in resampled:
            if point.value is None:
                continue

            is_above = point.value > threshold

            if was_above is not None and was_above != is_above:
                crossings += 1

            was_above = is_above

        return crossings

    def _get_thresholds(self, metric: str) -> dict:
        """
        Get relevant thresholds for different metrics.
        """
        thresholds = {
            'moisture': {'critical_low': 15, 'optimal_low': 22, 'optimal_high': 35},
            'ec': {'optimal_low': 0.5, 'optimal_high': 2.5, 'salinity': 4.0},
            'temperature': {'stress_low': 15, 'optimal_low': 20, 'optimal_high': 30},
            'ph': {'acidic': 5.5, 'neutral': 7.0, 'alkaline': 8.0}
        }
        return thresholds.get(metric, {})

    def _cold_start_features(self, current_reading: float) -> dict:
        """
        Return minimal features when no history is available.
        """
        return {
            f"{self.target_metric}_current": current_reading,
            "is_cold_start": 1,
            "data_quality_score": 0.3
        }

    @staticmethod
    def _get_window_data(resampled: List[ResampledPoint], window_hours: int) -> List[float]:
        """
        Extract values from the most recent N hours.
        """
        window_points = int(window_hours * 2)  # 30-min intervals
        recent_points = resampled[-window_points:]
        return [p.value for p in recent_points if p.value is not None]

    @staticmethod
    def _calculate_completeness(readings: List[tuple], window_hours: int) -> float:
        """
        Calculate % of expected readings that were actually received.
        """
        if len(readings) < 2:
            return 0.0

        expected_interval_minutes = 30
        expected_readings = (window_hours * 60) / expected_interval_minutes
        actual_readings = len([r for r in readings
                             if (datetime.now() - r[0]).total_seconds() / 3600 <= window_hours])

        return min(actual_readings / expected_readings, 1.0)
```

---

See Part 3 for ML model architectures, crop-aware heuristics, and operational deployment.
