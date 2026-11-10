"""
BioTrajectory Clinical Safety Service
Multi-vector emergency triage, disclaimer management, diagnosis/prescription prevention,
and missing-data handling.
"""

import re
import logging
from typing import Tuple, Optional, Dict, Any
from app.models.schemas import WarningCard
from app.utils.helpers import build_warning_card

logger = logging.getLogger("biotrajectory.safety")


class ClinicalSafetyService:
    """Comprehensive safety validation, clinical boundary enforcement, and emergency triage."""

    # Emergency symptom patterns (Cardiac, Neurological, Respiratory, Hemorrhagic, Anaphylactic, Crisis)
    EMERGENCY_PATTERNS = [
        # Chest pain & Cardiac
        r"\b(chest\s+pain|crushing\s+chest|chest\s+pressure|heart\s+attack|pain\s+radiat(ing|es)\s+to\s+(left\s+arm|jaw|neck))\b",
        # Respiratory distress
        r"\b(cannot\s+breathe|can\'?t\s+breathe|severe\s+shortness\s+of\s+breath|gasping\s+for\s+air|suffocating|choking|blue\s+lips)\b",
        # Stroke / Neurological red flags
        r"\b(stroke|facial\s+droop|slurred\s+speech|sudden\s+numbness\s+on\s+one\s+side|sudden\s+paralysis|worst\s+headache\s+of\s+my\s+life|thunderclap\s+headache)\b",
        # Acute Severe Hemorrhage
        r"\b(coughing\s+up\s+blood|vomiting\s+blood|uncontrolled\s+bleeding|severe\s+blood\s+loss)\b",
        # Anaphylaxis
        r"\b(throat\s+closing|anaphylaxis|swollen\s+tongue\s+and\s+throat|severe\s+allergic\s+reaction)\b",
        # Mental Health Crisis / Self-harm
        r"\b(kill\s+myself|commit\s+suicide|want\s+to\s+die|overdosed\s+on\s+pills|end\s+my\s+life)\b"
    ]

    # Regex for hypertensive crisis detection from numbers in query (e.g. 190/125, 200/130, 185/115)
    BP_PATTERN = re.compile(r"\b(\d{2,3})\s*[/\\-]\s*(\d{2,3})\b")
    # Blood glucose extremes (e.g. glucose 45 or 450)
    GLUCOSE_PATTERN = re.compile(r"\b(glucose|sugar)\s*(?:is|level|reading|of)?\s*[:=]?\s*(\d{2,3})\b", re.IGNORECASE)

    # Diagnosis and prescription disclaimer
    STANDARD_DISCLAIMER = (
        "\n\n---\n*Disclaimer: BioTrajectory AI is an educational assistant and does not provide "
        "medical diagnosis, treatment, or prescriptions. Always consult a qualified physician for clinical concerns.*"
    )

    @classmethod
    def evaluate_emergency(cls, query: str) -> Tuple[bool, Optional[str], Optional[WarningCard]]:
        """
        Multi-dimensional emergency detection combining semantic pattern analysis,
        acute symptom evaluation, and vital sign threshold checks.
        
        Returns:
            (is_emergency: bool, emergency_response_text: Optional[str], warning_card: Optional[WarningCard])
        """
        clean_text = query.lower().strip()

        # 1. Pattern & Symptom urgency scan
        for pattern in cls.EMERGENCY_PATTERNS:
            match = re.search(pattern, clean_text, re.IGNORECASE)
            if match:
                logger.warning(f"Clinical emergency pattern triggered: {match.group(0)}")
                
                # Check for suicide / crisis specific hotline
                if any(k in match.group(0) for k in ["suicide", "kill myself", "end my life", "want to die", "overdose"]):
                    crisis_text = (
                        "🚨 **URGENT CRISIS SUPPORT NEEDED**:\n\n"
                        "If you or someone you know is in crisis or having thoughts of self-harm, please reach out for immediate help:\n\n"
                        "- **National Suicide & Crisis Lifeline**: Dial or text **988** (available 24/7, free and confidential in the US/Canada).\n"
                        "- **Emergency Services**: Dial **911** or your local emergency number (e.g. **112** in the EU/India).\n"
                        "- **Crisis Text Line**: Text **HOME** to **741741**.\n\n"
                        "Please speak with someone who can support you right now. You are not alone."
                    )
                    card = build_warning_card(
                        level="critical",
                        title="Urgent Crisis Support",
                        measurement="Immediate crisis intervention required",
                        recommendation="Please dial 988 or 911 immediately to speak with a crisis specialist.",
                        action_text="Call 988 Crisis Lifeline Now"
                    )
                    return True, crisis_text, card

                # General medical emergency
                emergency_text = (
                    "⚠️ **IMMEDIATE EMERGENCY MEDICAL GUIDANCE**:\n\n"
                    "The symptoms or signs you described require **urgent in-person emergency evaluation**.\n\n"
                    "1. **Call Emergency Services Immediately**: Dial **911**, **112**, or your local emergency operator right now.\n"
                    "2. **Do Not Drive Yourself**: Have an ambulance or someone else take you to the closest Emergency Department.\n"
                    "3. **Stay Calm & Rest**: Sit comfortably, loosen tight clothing, and do not exert yourself while help is on the way.\n\n"
                    "*Do not wait to see if symptoms improve. Immediate medical assessment can be life-saving.*"
                )
                card = build_warning_card(
                    level="critical",
                    title="Emergency Doctor Visit Needed",
                    measurement="Acute, severe red-flag symptoms reported",
                    recommendation="Please seek urgent in-person emergency medical care immediately.",
                    action_text="Call Emergency Services (911/112)"
                )
                return True, emergency_text, card

        # 2. Vital Sign Threshold Analysis: Hypertensive Crisis Check
        bp_match = cls.BP_PATTERN.search(query)
        if bp_match:
            try:
                systolic = int(bp_match.group(1))
                diastolic = int(bp_match.group(2))
                # Hypertensive crisis: systolic > 180 or diastolic > 120
                if systolic >= 180 or diastolic >= 120:
                    logger.warning(f"Hypertensive crisis threshold detected: {systolic}/{diastolic} mmHg")
                    crisis_bp_text = (
                        f"⚠️ **CRITICAL BLOOD PRESSURE ALERT ({systolic}/{diastolic} mmHg)**:\n\n"
                        "A blood pressure reading of **180 systolic or higher**, or **120 diastolic or higher**, is considered a **Hypertensive Crisis**.\n\n"
                        "- **If you have chest pain, shortness of breath, blurry vision, numbness, or back pain**: Call **911** or your local emergency number immediately.\n"
                        "- **If you have no symptoms**: Wait 5 minutes in a quiet seated position and re-measure. If the numbers remain at or above 180/120 mmHg, seek immediate emergency medical care.\n\n"
                        "*Do not delay seeking medical evaluation for readings in this range.*"
                    )
                    card = build_warning_card(
                        level="critical",
                        title="Hypertensive Crisis Warning",
                        measurement=f"Reading: {systolic}/{diastolic} mmHg (Severely High)",
                        recommendation="Re-check quietly in 5 mins. If still >=180/>=120 or accompanied by symptoms, seek immediate emergency care.",
                        action_text="Emergency Consultation Needed"
                    )
                    return True, crisis_bp_text, card
            except (ValueError, IndexError):
                pass

        # 3. Blood Glucose Extremes
        glucose_match = cls.GLUCOSE_PATTERN.search(query)
        if glucose_match:
            try:
                val = int(glucose_match.group(2))
                if val < 54:
                    # Severe Hypoglycemia
                    hypo_text = (
                        f"⚠️ **CRITICAL LOW BLOOD GLUCOSE ({val} mg/dL)**:\n\n"
                        "A blood sugar reading below **54 mg/dL** indicates **severe hypoglycemia**, which requires immediate treatment:\n\n"
                        "1. **Consume 15–20g of fast-acting sugar immediately**: 4 oz fruit juice, 1/2 can regular soda, or 4 glucose tablets.\n"
                        "2. **Re-check in 15 minutes**: If still under 70 mg/dL, repeat fast-acting sugar.\n"
                        "3. **If confused, unable to swallow, or losing consciousness**: Someone must call **911** or administer emergency glucagon immediately."
                    )
                    card = build_warning_card(
                        level="critical",
                        title="Severe Hypoglycemia Warning",
                        measurement=f"Glucose: {val} mg/dL (Critically Low)",
                        recommendation="Consume 15g fast-acting carbohydrates immediately and recheck in 15 minutes.",
                        action_text="Emergency Hypoglycemia Protocol"
                    )
                    return True, hypo_text, card
                elif val > 400:
                    hyper_text = (
                        f"⚠️ **CRITICAL HIGH BLOOD GLUCOSE ({val} mg/dL)**:\n\n"
                        "A blood sugar reading above **400 mg/dL** is dangerously elevated and carries risk of Diabetic Ketoacidosis (DKA) or Hyperosmolar Hyperglycemic State (HHS).\n\n"
                        "Please contact your endocrinologist or seek urgent medical attention, especially if accompanied by nausea, vomiting, confusion, or excessive thirst."
                    )
                    card = build_warning_card(
                        level="critical",
                        title="Critical Hyperglycemia Warning",
                        measurement=f"Glucose: {val} mg/dL (Severely High)",
                        recommendation="Contact your healthcare provider or visit urgent care immediately.",
                        action_text="Seek Medical Care Now"
                    )
                    return True, hyper_text, card
            except (ValueError, IndexError):
                pass

        return False, None, None

    @classmethod
    def enforce_educational_boundaries(cls, response_text: str) -> str:
        """
        Verify that output maintains educational tone, does not diagnose or prescribe,
        and includes clear clinical disclaimers.
        """
        # Flag and reframe explicit diagnostic phrases if generated
        forbidden_diagnostic = [
            r"\bi\s+diagnose\s+you\s+with\b",
            r"\byou\s+definitely\s+have\s+(the\s+disease|diabetes|hypertension|ckd)\b",
            r"\byou\s+must\s+take\s+\d+\s*(mg|milligrams)\b"
        ]

        cleaned = response_text
        for phrase in forbidden_diagnostic:
            if re.search(phrase, cleaned, re.IGNORECASE):
                logger.warning("Safety boundary: AI model output contained diagnostic/prescriptive phrasing. Applying educational disclaimer.")
                cleaned = re.sub(phrase, "a doctor would evaluate for", cleaned, flags=re.IGNORECASE)

        return cleaned

    @classmethod
    def generate_missing_records_notice(cls, metric_name: str = "health records") -> str:
        """
        Standard educational response when personal records are requested
        but unverified or production database is unconfigured.
        """
        return (
            f"I cannot access your verified personal {metric_name} at this time because production "
            "database authentication has not been verified. In adherence to clinical privacy and data security "
            "standards, I will not fabricate or estimate your personal readings.\n\n"
            "However, I would be glad to explain general healthy reference ranges and everyday wellness principles! "
            "For example, would you like to learn about standard blood pressure categories, daily walking targets, "
            "or how laboratory markers are typically interpreted?"
        )
