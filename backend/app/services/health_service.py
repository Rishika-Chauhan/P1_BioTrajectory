"""
BioTrajectory Health Data Service
Modular processing for health records, trend analysis, clinical averages,
and production authentication boundary enforcement.
"""

import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.core.config import settings

logger = logging.getLogger("biotrajectory.health")


# Established clinical reference guidelines for educational explanations
CLINICAL_REFERENCE_RANGES = {
    "blood_pressure": {
        "normal": {"systolic_max": 120, "diastolic_max": 80, "description": "Normal blood pressure"},
        "elevated": {"systolic_min": 120, "systolic_max": 129, "diastolic_max": 80, "description": "Elevated blood pressure"},
        "stage1_hypertension": {"systolic_min": 130, "systolic_max": 139, "diastolic_min": 80, "diastolic_max": 89, "description": "Stage 1 Hypertension"},
        "stage2_hypertension": {"systolic_min": 140, "diastolic_min": 90, "description": "Stage 2 Hypertension"},
        "hypertensive_crisis": {"systolic_min": 180, "diastolic_min": 120, "description": "Hypertensive Crisis (Emergency)"}
    },
    "resting_heart_rate": {
        "normal_adult": {"min": 60, "max": 100, "unit": "bpm"},
        "athletic": {"min": 40, "max": 60, "unit": "bpm"}
    },
    "steps": {
        "sedentary": {"max": 4999},
        "low_active": {"min": 5000, "max": 7499},
        "somewhat_active": {"min": 7500, "max": 9999},
        "active": {"min": 10000, "max": 12499},
        "highly_active": {"min": 12500}
    },
    "urine_protein": {
        "negative": {"max": 15, "unit": "mg/dL", "clinical": "Normal (Glomerular filter intact)"},
        "trace": {"min": 15, "max": 30, "unit": "mg/dL", "clinical": "Borderline / Trace"},
        "elevated": {"min": 30, "unit": "mg/dL", "clinical": "Elevated - doctor follow-up recommended"}
    }
}


class HealthDataService:
    """Manages clinical health metrics, averages, trends, and verification boundaries."""

    @staticmethod
    def is_production_ready() -> bool:
        """Check if production database and authentication are configured."""
        return settings.is_production_firebase_configured

    @classmethod
    def retrieve_authorized_health_records(
        cls,
        user_id: Optional[str],
        is_production_authenticated: bool
    ) -> Dict[str, Any]:
        """
        Retrieve authorized health records.
        
        Strict Requirements:
        - Verify authentication tokens on backend before retrieving personal records.
        - Never trust an arbitrary user ID sent by frontend.
        - If production authentication is not configured, keep personal health retrieval disabled.
        - Never fabricate health readings or present synthetic data as real patient information.
        """
        if not cls.is_production_ready() or not is_production_authenticated or not user_id:
            logger.info("Personal health record retrieval blocked: Production auth not verified.")
            return {
                "available": False,
                "status": "personal_records_disabled",
                "reason": (
                    "Production Firebase authentication is not configured. In compliance with "
                    "health data privacy regulations and system safety requirements, personal health "
                    "record access is disabled. Synthetic demonstration data is never presented as "
                    "real patient information."
                ),
                "data": None,
                "records": []
            }

        # If production database is connected in the future, records are queried here
        return {
            "available": True,
            "status": "active",
            "reason": None,
            "data": {},
            "records": []
        }

    @staticmethod
    def filter_records_by_date(
        records: List[Dict[str, Any]],
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Filter a list of record dictionaries by ISO date strings (YYYY-MM-DD)."""
        if not records:
            return []

        filtered = records
        if start_date:
            filtered = [r for r in filtered if r.get("date", "") >= start_date]
        if end_date:
            filtered = [r for r in filtered if r.get("date", "") <= end_date]

        return filtered

    @staticmethod
    def calculate_averages(records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate mathematical averages for key clinical metrics.
        Returns None if no records are provided.
        """
        if not records:
            return {}

        n = len(records)
        systolic_vals = [r["systolic"] for r in records if "systolic" in r and isinstance(r["systolic"], (int, float))]
        diastolic_vals = [r["diastolic"] for r in records if "diastolic" in r and isinstance(r["diastolic"], (int, float))]
        pulse_vals = [r["pulse"] for r in records if "pulse" in r and isinstance(r["pulse"], (int, float))]
        steps_vals = [r["steps"] for r in records if "steps" in r and isinstance(r["steps"], (int, float))]
        exercise_vals = [r["exerciseMins"] for r in records if "exerciseMins" in r and isinstance(r["exerciseMins"], (int, float))]

        return {
            "record_count": n,
            "avg_systolic": round(sum(systolic_vals) / len(systolic_vals), 1) if systolic_vals else None,
            "avg_diastolic": round(sum(diastolic_vals) / len(diastolic_vals), 1) if diastolic_vals else None,
            "avg_pulse": round(sum(pulse_vals) / len(pulse_vals), 1) if pulse_vals else None,
            "avg_steps": round(sum(steps_vals) / len(steps_vals)) if steps_vals else None,
            "avg_exercise_mins": round(sum(exercise_vals) / len(exercise_vals), 1) if exercise_vals else None
        }

    @classmethod
    def identify_trends(cls, records: List[Dict[str, Any]]) -> Dict[str, str]:
        """
        Identify directional trends across chronological records (minimum 3 records).
        """
        if not records or len(records) < 3:
            return {"status": "insufficient_data_for_trends"}

        # Sort by date ascending
        sorted_records = sorted(records, key=lambda x: x.get("date", ""))
        mid = len(sorted_records) // 2
        first_half = sorted_records[:mid]
        second_half = sorted_records[mid:]

        avg_first = cls.calculate_averages(first_half)
        avg_second = cls.calculate_averages(second_half)

        trends = {}
        # Blood pressure trend
        if avg_first.get("avg_systolic") and avg_second.get("avg_systolic"):
            diff_sys = avg_second["avg_systolic"] - avg_first["avg_systolic"]
            if diff_sys >= 3.0:
                trends["blood_pressure"] = "trending_upward"
            elif diff_sys <= -3.0:
                trends["blood_pressure"] = "trending_downward"
            else:
                trends["blood_pressure"] = "stable"

        # Steps activity trend
        if avg_first.get("avg_steps") and avg_second.get("avg_steps"):
            diff_steps = avg_second["avg_steps"] - avg_first["avg_steps"]
            if diff_steps > 500:
                trends["physical_activity"] = "increasing"
            elif diff_steps < -500:
                trends["physical_activity"] = "decreasing"
            else:
                trends["physical_activity"] = "steady"

        return trends

    @classmethod
    def generate_summary(cls, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate structured summary containing count, averages, and trend direction."""
        if not records:
            return {
                "available": False,
                "summary": "No authorized records available."
            }

        averages = cls.calculate_averages(records)
        trends = cls.identify_trends(records)

        return {
            "available": True,
            "averages": averages,
            "trends": trends,
            "generated_at": datetime.utcnow().isoformat()
        }
