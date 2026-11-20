from typing import Any, Dict, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class CreateFamilyRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Family name cannot be empty")
        return value


class InviteMemberRequest(BaseModel):
    email: EmailStr


class AcceptInvitationRequest(BaseModel):
    token: str = Field(..., min_length=32, max_length=256)


class PermissionsRequest(BaseModel):
    viewReadings: Optional[bool] = None
    viewAnalytics: Optional[bool] = None
    viewMedicalHistory: Optional[bool] = None
    viewReports: Optional[bool] = None


class FamilyResponse(BaseModel):
    success: bool = True
    family: Optional[Dict[str, Any]] = None
