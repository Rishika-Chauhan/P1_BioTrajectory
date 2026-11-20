
from typing import Any, Dict

from fastapi import APIRouter, Depends, Query

from app.core.security import get_current_user
from app.models.family import (
    CreateFamilyRequest,
    InviteMemberRequest,
    PermissionsRequest,
)
from app.services.family_service import family_service

router = APIRouter(prefix="/api", tags=["Family Management"])


# --------------------------------------------------
# CREATE FAMILY
# --------------------------------------------------

@router.post("/families")
async def create_family(
    payload: CreateFamilyRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return {
        "success": True,
        "data": family_service.create_family(
            current_user["uid"],
            payload.name,
        ),
    }


# --------------------------------------------------
# GET MY FAMILY
# --------------------------------------------------

@router.get("/families/me")
async def get_my_family(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return {
        "success": True,
        "data": family_service.get_family(current_user["uid"]),
    }


# --------------------------------------------------
# LIST FAMILY MEMBERS
# --------------------------------------------------

@router.get("/families/{family_id}/members")
async def list_family_members(
    family_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return {
        "success": True,
        "data": family_service.list_members(
            current_user["uid"],
            family_id,
        ),
    }


# --------------------------------------------------
# INVITE REGISTERED USER
# --------------------------------------------------

@router.post("/families/{family_id}/invitations")
async def invite_member(
    family_id: str,
    payload: InviteMemberRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return family_service.invite_member(
        current_user["uid"],
        family_id,
        str(payload.email),
    )


# --------------------------------------------------
# GET PENDING INVITATIONS FOR SIGNED-IN USER
# --------------------------------------------------

@router.get("/family-invitations/pending")
async def get_pending_invitations(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return family_service.get_pending_invitations(
        current_user["uid"],
    )


# --------------------------------------------------
# ACCEPT INVITATION
# --------------------------------------------------

@router.post("/family-invitations/{invitation_id}/accept")
async def accept_invitation(
    invitation_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return {
        "success": True,
        "data": family_service.accept_invitation(
            current_user["uid"],
            invitation_id,
        ),
    }


# --------------------------------------------------
# REJECT INVITATION
# --------------------------------------------------

@router.post("/family-invitations/{invitation_id}/reject")
async def reject_invitation(
    invitation_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return family_service.reject_invitation(
        current_user["uid"],
        invitation_id,
    )


# --------------------------------------------------
# LIST FAMILY OWNER'S INVITATIONS
# --------------------------------------------------

@router.get("/families/{family_id}/invitations")
async def list_invitations(
    family_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    self_family = family_service.get_family(
        current_user["uid"],
        family_id,
    )

    return {
        "success": True,
        "invitations": self_family["invitations"],
    }


# --------------------------------------------------
# REVOKE INVITATION
# --------------------------------------------------

@router.delete("/families/{family_id}/invitations/{invitation_id}")
async def revoke_invitation(
    family_id: str,
    invitation_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return family_service.revoke_invitation(
        current_user["uid"],
        family_id,
        invitation_id,
    )


# --------------------------------------------------
# REMOVE FAMILY MEMBER
# --------------------------------------------------

@router.delete("/families/{family_id}/members/{uid}")
async def remove_member(
    family_id: str,
    uid: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return family_service.remove_member(
        current_user["uid"],
        family_id,
        uid,
    )


# --------------------------------------------------
# LEAVE FAMILY
# --------------------------------------------------

@router.post("/families/{family_id}/leave")
async def leave_family(
    family_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return family_service.leave_family(
        current_user["uid"],
        family_id,
    )


# --------------------------------------------------
# DISBAND FAMILY
# --------------------------------------------------

@router.delete("/families/{family_id}")
async def disband_family(
    family_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return family_service.disband_family(
        current_user["uid"],
        family_id,
    )


# --------------------------------------------------
# UPDATE HEALTH SHARING PERMISSIONS
# --------------------------------------------------

@router.patch("/families/{family_id}/members/{uid}/permissions")
async def update_permissions(
    family_id: str,
    uid: str,
    payload: PermissionsRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return family_service.update_permissions(
        current_user["uid"],
        family_id,
        uid,
        payload.model_dump(exclude_none=True),
    )


# --------------------------------------------------
# GET AUTHORIZED FAMILY MEMBER READINGS
# --------------------------------------------------

@router.get("/family-members/{uid}/readings")
async def get_family_member_readings(
    uid: str,
    limit: int = Query(default=100, ge=1, le=100),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    return family_service.get_authorized_readings(
        current_user["uid"],
        uid,
        limit,
    )
