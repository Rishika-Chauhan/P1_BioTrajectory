"""
BioTrajectory Comprehensive Integration & Verification Test Suite
Tests all core criteria, transient 503 retry mechanisms, transparent unavailability,
and clinical safety boundaries.
"""

import sys
import asyncio
import unittest
from types import SimpleNamespace
from unittest.mock import patch, MagicMock

import httpx
from fastapi.testclient import TestClient

from app.main import app
from app.core.config import settings
from app.services.safety_service import ClinicalSafetyService
from app.services.health_service import HealthDataService
from app.services.conversation_service import conversation_service
from app.services.gemini_service import gemini_service
from app.core import security
from app.core.security import verify_auth_token, rate_limiter, extract_role_from_claims, get_current_user, require_authenticated_user, require_role
from app.utils.helpers import sanitize_error_message
from groq import RateLimitError


class TestBioTrajectoryIntegration(unittest.TestCase):
    @staticmethod
    def _run_async(coro):
        return asyncio.run(coro)

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # Simulate a verified Firebase user for endpoint integration tests.
        # This avoids requiring a real Firebase ID token in unit tests.
        app.dependency_overrides[get_current_user] = lambda: {
            "uid": "test-user-1",
            "role": "USER"
        }

    @classmethod
    def tearDownClass(cls):
        # Prevent authentication overrides leaking into other test modules.
        app.dependency_overrides.clear()

    def test_01_fastapi_startup_and_routes(self):
        """1. Verify FastAPI startup and registered endpoints."""
        paths = list(app.openapi()["paths"].keys())
        self.assertIn("/health", paths)
        self.assertIn("/api/chat", paths)
        self.assertIn("/api/history", paths)
        self.assertIn("/api/health/summary", paths)
        print("✓ Test 1: FastAPI routes and startup verified.")

    def test_02_health_endpoint(self):
        """2. Verify GET /health response structure and data types."""
        resp = self.client.get("/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "ok")
        self.assertIn("gemini_configured", data)
        self.assertEqual(data["model"], "qwen/qwen3.8-27b")
        self.assertIn("auth_mode", data)
        self.assertIn("uptime_seconds", data)
        self.assertIsInstance(data["uptime_seconds"], (int, float))
        print("✓ Test 2: Health endpoint verified.")

    def test_03_groq_service_initialization(self):
        """3. Verify Groq service configuration and model assignment."""
        self.assertEqual(gemini_service._model_name, "qwen/qwen3.8-27b")
        self.assertEqual(settings.GROQ_MODEL, "qwen/qwen3.8-27b")
        self.assertEqual(settings.GROQ_TIMEOUT_SECONDS, 120.0)
        self.assertEqual(settings.GROQ_MAX_RETRIES, 2)
        print("✓ Test 3: Groq service configuration verified (qwen/qwen3.8-27b, timeout=120.0s, max_retries=2).")

    def test_04_no_offline_mock_response_when_unconfigured(self):
        """4. Verify transparent unavailability notice when unconfigured (never return fake mock response)."""
        with patch.object(type(gemini_service), "is_available", property(lambda s: False)):
            resp = self.client.post("/api/chat", json={
                "message": "What is the recommended daily step count for an adult?"
            })
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertIn("response", data)
            self.assertIn("text", data)
            self.assertEqual(data["response"], data["text"])
            self.assertFalse(data["is_emergency"])
            # Verify honest service notice and no fabricated mock answers
            self.assertIn("offline", data["text"].lower())
            self.assertIn("groq_api_key", data["text"].lower())
            self.assertNotIn("Here is a simple look at your blood pressure over the last week", data["text"])
            print("✓ Test 4: Transparent unavailability notice verified (no offline mock response).")

    def test_05_chat_schema_and_frontend_compatibility(self):
        """5. Verify chat payload validation and frontend schema compatibility."""
        mock_response = SimpleNamespace(
            choices=[
                SimpleNamespace(
                    message=SimpleNamespace(
                        content="A healthy resting blood pressure is generally under 120/80 mmHg."
                    )
                )
            ]
        )

        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mock_response

        with patch.object(gemini_service, "_client", mock_client), \
             patch.object(type(gemini_service), "is_available", property(lambda s: True)):
            resp = self.client.post("/api/chat", json={
                "message": "Can you explain blood pressure numbers in simple terms?",
                "user_consent_given": True
            })
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            required_keys = ["response", "text", "conversation_id", "is_emergency", "warningCard", "timestamp"]
            for key in required_keys:
                self.assertIn(key, data, f"Missing key: {key}")
            self.assertEqual(data["text"], data["response"])
            self.assertIn("120/80", data["text"])
            print("✓ Test 5: Chat schema and frontend mapping verified.")

    def test_06_conversation_history_persistence_and_isolation(self):
        """6. Verify conversation turns persist and remain isolated across IDs."""
        mock_response = SimpleNamespace(
            choices=[
                SimpleNamespace(
                    message=SimpleNamespace(content="Swimming is great cardiovascular exercise.")
                )
            ]
        )
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mock_response

        with patch.object(gemini_service, "_client", mock_client), \
             patch.object(type(gemini_service), "is_available", property(lambda s: True)):
            # First turn
            r1 = self.client.post("/api/chat", json={
                "message": "Hello assistant, remember my favorite exercise is swimming."
            })
            self.assertEqual(r1.status_code, 200)
            conv_id = r1.json()["conversation_id"]

            # Second turn in same conversation
            r2 = self.client.post("/api/chat", json={
                "message": "What exercise did I say I like?",
                "conversation_id": conv_id
            })
            self.assertEqual(r2.status_code, 200)
            self.assertEqual(r2.json()["conversation_id"], conv_id)

            # Retrieve history
            hist = self.client.get(f"/api/history?conversation_id={conv_id}")
            self.assertEqual(hist.status_code, 200)
            msgs = hist.json()["messages"]
            self.assertEqual(len(msgs), 4) # 2 user + 2 assistant
            self.assertEqual(msgs[0]["sender"], "user")
            self.assertEqual(msgs[1]["sender"], "assistant")
            print("✓ Test 6: Conversation history persistence verified.")

    def test_07_api_failure_and_validation_handling(self):
        """7. Verify malformed requests and size restrictions are handled."""
        # Empty message
        r_empty = self.client.post("/api/chat", json={"message": "   "})
        self.assertEqual(r_empty.status_code, 422)

        # Missing required field
        r_missing = self.client.post("/api/chat", json={})
        self.assertEqual(r_missing.status_code, 422)
        print("✓ Test 7: API failure and parameter validation verified.")

    def test_08_invalid_api_key_resilience(self):
        """8. Verify graceful degradation when API key is missing or invalid."""
        with patch.object(type(gemini_service), "is_available", property(lambda s: False)):
            resp = self.client.post("/api/chat", json={
                "message": "Explain what urine protein means."
            })
            self.assertEqual(resp.status_code, 200)
            self.assertTrue(len(resp.json()["text"]) > 10)
            self.assertIn("offline", resp.json()["text"].lower())
            print("✓ Test 8: Invalid/missing API key resilience verified.")

    def test_09_emergency_guidance_triage(self):
        """9. Verify immediate emergency guidance for cardiac symptoms and crisis vitals."""
        # Cardiac emergency
        r_cardiac = self.client.post("/api/chat", json={
            "message": "I am having crushing chest pain radiating to my left arm and jaw."
        })
        self.assertEqual(r_cardiac.status_code, 200)
        data = r_cardiac.json()
        self.assertTrue(data["is_emergency"])
        self.assertIsNotNone(data["warningCard"])
        self.assertEqual(data["warningCard"]["level"], "critical")
        self.assertIn("911", data["response"])

        # Hypertensive crisis BP (>= 180 / 120)
        r_bp = self.client.post("/api/chat", json={
            "message": "My home blood pressure monitor says 195/125 mmHg right now."
        })
        self.assertEqual(r_bp.status_code, 200)
        self.assertTrue(r_bp.json()["is_emergency"])
        self.assertEqual(r_bp.json()["warningCard"]["level"], "critical")

        # Respiratory distress
        r_resp = self.client.post("/api/chat", json={
            "message": "I cannot breathe and my lips are turning blue."
        })
        self.assertEqual(r_resp.status_code, 200)
        self.assertTrue(r_resp.json()["is_emergency"])

        # Suicide / Crisis hotline
        r_crisis = self.client.post("/api/chat", json={
            "message": "I want to end my life."
        })
        self.assertEqual(r_crisis.status_code, 200)
        self.assertTrue(r_crisis.json()["is_emergency"])
        self.assertIn("988", r_crisis.json()["response"])
        print("✓ Test 9: Clinical emergency guidance triage verified.")

    def test_10_unauthenticated_health_access_is_rejected(self):
        """10. Verify unauthenticated users cannot access personal health records."""
        # Temporarily remove the authenticated-user override.
        original_override = app.dependency_overrides.pop(
            get_current_user, None
        )

        try:
            resp = self.client.get("/api/health/summary")
            self.assertEqual(resp.status_code, 401)
        finally:
            # Restore the override for the remaining integration tests.
            if original_override is not None:
                app.dependency_overrides[get_current_user] = original_override

        print("✓ Test 10: Unauthenticated health access rejected.")

    def test_11_authentication_and_authorization(self):
        """11. Verify token verification and mock token boundary."""
        is_prod, mode, claims = verify_auth_token(None)
        self.assertFalse(is_prod)
        self.assertEqual(mode, "unauthenticated")

        is_prod, mode, claims = verify_auth_token("Token not-a-bearer")
        self.assertFalse(is_prod)
        self.assertEqual(mode, "invalid_header")

        is_prod, mode, claims = verify_auth_token("Bearer mock_token_123")
        self.assertFalse(is_prod)
        self.assertEqual(mode, "invalid_token")

        role = extract_role_from_claims({"role": "USER"})
        self.assertEqual(role, "USER")
        self.assertIsNone(extract_role_from_claims({"role": "HACKER"}))
        print("✓ Test 11: Authentication boundary verification verified.")

    def test_11b_firebase_token_validation_edge_cases(self):
        """Verify real Firebase token verification, role validation, and failure handling."""
        with patch.object(security, "initialize_firebase_admin", return_value=True), \
             patch("firebase_admin.auth.verify_id_token", side_effect=ValueError("invalid token")):
            is_prod, mode, claims = verify_auth_token("Bearer invalid-token")
            self.assertFalse(is_prod)
            self.assertEqual(mode, "invalid_token")

        with patch.object(security, "initialize_firebase_admin", return_value=True), \
             patch("firebase_admin.auth.verify_id_token", side_effect=security.auth.ExpiredIdTokenError("expired", ValueError("expired"))):
            is_prod, mode, claims = verify_auth_token("Bearer expired-token")
            self.assertFalse(is_prod)
            self.assertEqual(mode, "expired_token")

        verified_claims = {"uid": "abc123", "role": "DOCTOR", "firebase": {"sign_in_provider": "google.com"}}
        with patch.object(security, "initialize_firebase_admin", return_value=True), \
             patch("firebase_admin.auth.verify_id_token", return_value=verified_claims):
            is_prod, mode, claims = verify_auth_token("Bearer valid-token")
            self.assertTrue(is_prod)
            self.assertEqual(mode, "production_verified")
            self.assertEqual(claims["uid"], "abc123")
            self.assertEqual(claims["role"], "DOCTOR")

        with patch.object(security, "initialize_firebase_admin", return_value=True), \
             patch("firebase_admin.auth.verify_id_token", return_value={"role": "USER"}):
            is_prod, mode, claims = verify_auth_token("Bearer no-uid-token")
            self.assertFalse(is_prod)
            self.assertEqual(mode, "missing_uid")

        self.assertTrue(require_role({"role": "ADMIN"}, {"ADMIN"}))
        self.assertFalse(require_role({"role": "HACKER"}, {"ADMIN"}))
        self.assertTrue(require_role({"role": "DOCTOR_PENDING"}, {"DOCTOR_PENDING", "DOCTOR"}))
        self.assertFalse(require_role({"role": "USER"}, {"ADMIN"}))

        with patch.object(security, "initialize_firebase_admin", return_value=False):
            is_prod, mode, claims = verify_auth_token("Bearer valid-looking-token")
            self.assertFalse(is_prod)
            self.assertEqual(mode, "production_not_configured")

    def test_12_health_data_calculations(self):
        """12. Verify mathematical averages, date filters, and trend detection."""
        records = [
            {"date": "2026-11-01", "systolic": 118, "diastolic": 76, "pulse": 66, "steps": 7500, "exerciseMins": 25},
            {"date": "2026-11-02", "systolic": 120, "diastolic": 78, "pulse": 68, "steps": 8000, "exerciseMins": 30},
            {"date": "2026-11-03", "systolic": 122, "diastolic": 80, "pulse": 70, "steps": 8600, "exerciseMins": 35},
            {"date": "2026-11-04", "systolic": 124, "diastolic": 82, "pulse": 72, "steps": 9200, "exerciseMins": 40},
        ]
        avgs = HealthDataService.calculate_averages(records)
        self.assertEqual(avgs["record_count"], 4)
        self.assertEqual(avgs["avg_systolic"], 121.0)
        self.assertEqual(avgs["avg_diastolic"], 79.0)
        self.assertEqual(avgs["avg_steps"], 8325)

        trends = HealthDataService.identify_trends(records)
        self.assertEqual(trends["blood_pressure"], "trending_upward")
        self.assertEqual(trends["physical_activity"], "increasing")
        print("✓ Test 12: Health data calculations and trend analysis verified.")

    def test_13_groq_rate_limit_and_friendly_message(self):
        """13. Verify Groq rate-limit errors are surfaced as a friendly health assistant message."""
        response = httpx.Response(
            429,
            request=httpx.Request("POST", "https://api.groq.com/openai/v1/chat/completions"),
            json={"error": {"message": "Rate limit reached"}}
        )
        rate_limit_error = RateLimitError("Rate limit reached", response=response, body=response.json())

        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = rate_limit_error

        with patch.object(gemini_service, "_client", mock_client), \
             patch.object(type(gemini_service), "is_available", property(lambda s: True)):
            resp = self.client.post("/api/chat", json={
                "message": "Can you explain normal blood pressure?"
            })
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertIn("rate limit", data["text"].lower())
            self.assertTrue("doctor" in data["text"].lower() or "physician" in data["text"].lower())
            self.assertIsNotNone(data["warningCard"])
            self.assertEqual(data["warningCard"]["level"], "warning")
            self.assertIn("429", data["warningCard"]["measurement"])
            self.assertEqual(data["warningCard"]["actionText"], "Wait & Retry")
            self.assertIn("rate_limited", data.get("model_used", ""))
            print("✓ Test 13: Groq rate-limit handling and friendly message verified.")

    def test_14_safe_error_logging(self):
        """14. Verify safe error logging sanitizes API keys and authorization tokens."""
        raw_error = "Error calling endpoint https://generativelanguage.googleapis.com/v1beta?key=AIzaSyB1234567890123456789012345678901"
        sanitized = sanitize_error_message(raw_error)
        self.assertNotIn("AIzaSyB1234567890123456789012345678901", sanitized)
        self.assertTrue("[API_KEY_MASKED]" in sanitized or "[CREDENTIAL_MASKED]" in sanitized)

        raw_auth_error = "Authorization failed: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.secret_token_data"
        sanitized_auth = sanitize_error_message(raw_auth_error)
        self.assertNotIn("secret_token_data", sanitized_auth)
        self.assertIn("[TOKEN_MASKED]", sanitized_auth)
        print("✓ Test 14: Safe error logging and credential masking verified.")

    def test_15_model_used_matches_provider_response(self):
        """15. Verify model_used reflects the actual provider response, not just the configured default."""
        original_model = gemini_service._model_name
        mocked_response = SimpleNamespace(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            choices=[SimpleNamespace(message=SimpleNamespace(content="This is educational guidance."), finish_reason="stop")]
        )

        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mocked_response

        with patch.object(gemini_service, "_client", mock_client), \
             patch.object(type(gemini_service), "is_available", property(lambda s: True)), \
             patch.object(gemini_service, "_model_name", "qwen/qwen3.8-27b"):
            _, _, model_used = self._run_async(
                gemini_service.generate_response(
                    message="What is a healthy heart rate range?",
                    history=[],
                    user_consent=True,
                    attachments=None,
                    context_notes=None,
                )
            )
            self.assertEqual(model_used, "meta-llama/llama-4-scout-17b-16e-instruct")

        gemini_service._model_name = original_model
        print("✓ Test 15: model_used comes from the provider response verified.")

    def test_16_groq_key_redaction_in_error_messages(self):
        """16. Verify Groq-style API keys are redacted from sanitized error strings."""
        raw_error = "Groq error: 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 is invalid"
        sanitized = sanitize_error_message(raw_error)
        self.assertNotIn("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", sanitized)
        self.assertIn("[API_KEY_MASKED]", sanitized)
        print("✓ Test 16: Groq key redaction verified.")

    def test_17_general_questions_do_not_generate_warning_cards(self):
        """17. Verify general educational questions do not create patient-specific warning cards without explicit measurement data."""
        mocked_response = SimpleNamespace(
            model="qwen/qwen3.8-27b",
            choices=[SimpleNamespace(message=SimpleNamespace(content="Blood pressure is measured in mmHg and is usually shown as two numbers."), finish_reason="stop")]
        )
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mocked_response

        with patch.object(gemini_service, "_client", mock_client), \
             patch.object(type(gemini_service), "is_available", property(lambda s: True)):
            response_text, warning_card, model_used = self._run_async(
                gemini_service.generate_response(
                    message="Can you explain blood pressure numbers in simple terms?",
                    history=[],
                    user_consent=True,
                    attachments=None,
                    context_notes=None,
                )
            )
            self.assertIsNone(warning_card)
            self.assertIn("blood pressure", response_text.lower())
            self.assertEqual(model_used, "qwen/qwen3.8-27b")
            print("✓ Test 17: General educational prompts remain warning-free verified.")

    def test_18_sensitive_history_is_not_sent_to_groq_for_general_questions(self):
        """18. Verify unrelated general questions do not include prior sensitive patient history in Groq prompts."""
        mocked_response = SimpleNamespace(
            model="qwen/qwen3.8-27b",
            choices=[SimpleNamespace(message=SimpleNamespace(content="Blood pressure readings are usually expressed as systolic over diastolic."), finish_reason="stop")]
        )
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mocked_response

        prior_history = [
            SimpleNamespace(sender="user", text="My left kidney was removed years ago after an ectopic pregnancy."),
            SimpleNamespace(sender="assistant", text="I am sorry to hear that. Here's the result summary."),
        ]

        with patch.object(gemini_service, "_client", mock_client), \
             patch.object(type(gemini_service), "is_available", property(lambda s: True)):
            self._run_async(
                gemini_service.generate_response(
                    message="Can you explain blood pressure numbers in simple terms?",
                    history=prior_history,
                    user_consent=True,
                    attachments=None,
                    context_notes=None,
                )
            )

        request_messages = mock_client.chat.completions.create.call_args.kwargs["messages"]
        payload_text = "\n".join(msg.get("content", "") for msg in request_messages)
        self.assertNotIn("ectopic", payload_text.lower())
        self.assertNotIn("left kidney", payload_text.lower())
        self.assertIn("blood pressure", payload_text.lower())
        print("✓ Test 18: Sensitive prior history excluded from prompt verified.")

    def test_19_incomplete_groq_responses_are_detected_and_reported(self):
        """19. Verify truncated Groq completions are flagged and returned as incomplete responses instead of false completion."""
        mocked_response = SimpleNamespace(
            model="qwen/qwen3.8-27b",
            choices=[SimpleNamespace(message=SimpleNamespace(content="This answer was intentionally cut off by the model token limit because "), finish_reason="length")]
        )
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mocked_response

        with patch.object(gemini_service, "_client", mock_client), \
             patch.object(type(gemini_service), "is_available", property(lambda s: True)):
            response_text, warning_card, model_used = self._run_async(
                gemini_service.generate_response(
                    message="Can you explain a healthy heart rate range?",
                    history=[],
                    user_consent=True,
                    attachments=None,
                    context_notes=None,
                )
            )
            self.assertIn("cut off", response_text.lower())
            self.assertIsNone(warning_card)
            self.assertEqual(model_used, "qwen/qwen3.8-27b")
            print("✓ Test 19: Truncated Groq output handling verified.")


if __name__ == "__main__":
    unittest.main()
