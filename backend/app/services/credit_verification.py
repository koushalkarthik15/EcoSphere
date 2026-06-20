from typing import Dict, Any

class CreditVerificationService:
    """
    Validates eligibility of soil carbon sequestration offsets for credit minting.
    Enforces compliance guidelines (no active burns, stable biomass, sequestration minimums).
    """

    MIN_NDVI_THRESHOLD = 0.40
    MIN_SEQUESTRATION_TONS = 0.25

    @classmethod
    def verify_carbon_credits(
        cls,
        field_id: str,
        fire_status: str, # "SAFE", "DANGER"
        mean_ndvi: float,
        season_gain_tons: float,
        practice: str
    ) -> Dict[str, Any]:
        """
        Runs compliance checklist.
        Mints carbon credits if all validations pass, otherwise details rejection reason.
        """
        verified_credits = 0.0
        pending_credits = 0.0
        rejected_credits = 0.0
        status = "REJECTED"
        reason = ""

        # Checklist checks
        # 1. Fire compliance check
        if fire_status == "DANGER":
            rejected_credits = season_gain_tons
            status = "REJECTED"
            reason = "Active fire/stubble burn detected within field boundaries. Automatic rejection of seasonal offsets credits."
            return cls._build_response(status, verified_credits, pending_credits, rejected_credits, reason)

        # 2. Vegetation index check (Sentinel-2 NDVI)
        if mean_ndvi < cls.MIN_NDVI_THRESHOLD:
            rejected_credits = season_gain_tons
            status = "REJECTED"
            reason = f"Vegetation index (Mean NDVI: {round(mean_ndvi, 2)}) falls below the minimum conservation baseline threshold ({cls.MIN_NDVI_THRESHOLD})."
            return cls._build_response(status, verified_credits, pending_credits, rejected_credits, reason)

        # 3. Minimum Sequestration check
        if season_gain_tons < cls.MIN_SEQUESTRATION_TONS:
            pending_credits = season_gain_tons
            status = "PENDING"
            reason = f"Sequestration offset ({season_gain_tons} t) is below minimum threshold ({cls.MIN_SEQUESTRATION_TONS} t) for automatic verification. Under review."
            return cls._build_response(status, verified_credits, pending_credits, rejected_credits, reason)

        # 4. Conservation practice check
        if practice != "conservation":
            pending_credits = season_gain_tons
            status = "PENDING"
            reason = "Conventional farming practices detected. Soil credit auditing requires satellite soil tillage validation."
            return cls._build_response(status, verified_credits, pending_credits, rejected_credits, reason)

        # Automatic verification if all criteria are fully satisfied
        verified_credits = season_gain_tons
        status = "VERIFIED"
        reason = "All telemetry and conservation practice criteria satisfied. Carbon credits verified for ledger inclusion."

        return cls._build_response(status, verified_credits, pending_credits, rejected_credits, reason)

    @staticmethod
    def _build_response(
        status: str,
        verified: float,
        pending: float,
        rejected: float,
        reason: str
    ) -> Dict[str, Any]:
        return {
            "status": status,
            "verified_credits": round(verified, 2),
            "pending_credits": round(pending, 2),
            "rejected_credits": round(rejected, 2),
            "verification_reason": reason
        }
