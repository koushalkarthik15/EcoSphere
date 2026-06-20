from typing import Dict, Any

class IndustrialMathEngine:
    """
    Greenhouse Gas (GHG) and Financial Intelligence Engine for industrial auditors.
    Evaluates gas concentrations, solar installation ROIs, tax liabilities, and leak repair savings.
    """

    CH4_GWP_MULTIPLIER = 28.0      # Methane Global Warming Potential multiplier
    CARBON_TAX_PER_TON_CO2E = 125.0 # Regulatory carbon tax per metric ton of CO2e

    @classmethod
    def analyze_greenhouse_gases(
        self,
        methane_ppb: float,
        so2_ppb: float,
        acreage: float,
        baseline_annual_co2_tons: float
    ) -> Dict[str, Any]:
        """
        Calculates methane and SO2 mass indicators, total CO2e equivalents, leak severity,
        projections, and direct atmospheric regulatory exposures.
        """
        # Baseline Methane in Punjab is ~1850 ppb
        ch4_excess = max(0.0, methane_ppb - 1850.0)
        
        # Calculate active gas leakage rate (estimated metric tons of gas per year)
        # Higher acreage scales the total column density estimation
        ch4_leak_tons_year = ch4_excess * 0.05 * (acreage / 10.0)
        so2_leak_tons_year = max(0.0, so2_ppb - 1.0) * 0.08 * (acreage / 10.0)

        # Convert to CO2 equivalent
        ch4_co2e_tons = ch4_leak_tons_year * self.CH4_GWP_MULTIPLIER
        
        # Scope 1 total: baseline CO2 + leakage CO2e
        annual_scope1_co2e = baseline_annual_co2_tons + ch4_co2e_tons
        # Scope 2 total: conventional grid dependency (approx 30% of baseline)
        annual_scope2_co2e = baseline_annual_co2_tons * 0.30

        total_annual_co2e = annual_scope1_co2e + annual_scope2_co2e
        monthly_emissions_co2e = total_annual_co2e / 12.0

        # Determine Leak Severity
        if ch4_excess > 100.0 or so2_ppb > 5.0:
            severity = "CRITICAL"
        elif ch4_excess > 40.0 or so2_ppb > 2.0:
            severity = "HIGH"
        elif ch4_excess > 15.0 or so2_ppb > 1.2:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        # Financial loss estimates from leaks: methane is valuable natural gas
        # Retail natural gas value: ~$350 per ton
        annual_ch4_loss_value = ch4_leak_tons_year * 350.0
        # Pipeline energy loss: compressed gas/heat losses
        annual_energy_loss_value = annual_scope2_co2e * 8.50 # $8.50 per ton energy base
        
        total_annual_financial_loss = annual_ch4_loss_value + annual_energy_loss_value

        return {
            "methane_excess_ppb": round(ch4_excess, 1),
            "ch4_leak_tons_year": round(ch4_leak_tons_year, 2),
            "so2_leak_tons_year": round(so2_leak_tons_year, 2),
            "ch4_co2e_tons_year": round(ch4_co2e_tons, 1),
            "scope_1_annual_co2e_tons": round(annual_scope1_co2e, 1),
            "scope_2_annual_co2e_tons": round(annual_scope2_co2e, 1),
            "total_annual_co2e_tons": round(total_annual_co2e, 1),
            "monthly_co2e_tons": round(monthly_emissions_co2e, 1),
            "leak_severity": severity,
            "annual_financial_loss_usd": round(total_annual_financial_loss, 2),
            "regulatory_tax_exposure_usd": round(total_annual_co2e * self.CARBON_TAX_PER_TON_CO2E, 2)
        }

    @classmethod
    def audit_financial_intelligence(
        self,
        total_co2e_tons: float,
        leak_severity: str,
        annual_loss_usd: float,
        roof_area_sq_meters: float
    ) -> Dict[str, Any]:
        """
        Performs audits on carbon tax, waste losses, and solar panel ROI.
        """
        # Carbon Tax
        carbon_tax = total_co2e_tons * self.CARBON_TAX_PER_TON_CO2E

        # Leak Repair Savings (90% of leak losses are recoverable by patching leaks)
        leak_repair_savings = annual_loss_usd * 0.90 if leak_severity in ["HIGH", "CRITICAL", "MEDIUM"] else annual_loss_usd * 0.50

        # Solar Roof Installation Calculations
        # 10 sq meters of roof can support 1 kW of solar capacity
        solar_capacity_kw = roof_area_sq_meters / 10.0
        
        # Installation Cost: ~$1200 per kW
        install_cost_usd = solar_capacity_kw * 1200.0
        
        # Annual Solar Savings: generates ~1500 kWh per kW annually, offsetting ~$0.10/kWh grid cost
        annual_solar_savings_usd = solar_capacity_kw * 1500.0 * 0.10
        
        # Payback period in months
        payback_period_months = (install_cost_usd / annual_solar_savings_usd * 12.0) if annual_solar_savings_usd > 0 else 0.0

        # ESG score improvement: replaces Scope 2 electricity
        esg_improvement = min(15, int(solar_capacity_kw * 0.12))

        return {
            "carbon_tax_liability_usd": round(carbon_tax, 2),
            "operational_waste_usd": round(annual_loss_usd, 2),
            "leak_repair_savings_usd": round(leak_repair_savings, 2),
            "solar_roi": {
                "capacity_kw": round(solar_capacity_kw, 1),
                "install_cost_usd": round(install_cost_usd, 2),
                "annual_savings_usd": round(annual_solar_savings_usd, 2),
                "payback_period_months": round(payback_period_months, 1),
                "esg_improvement_score": esg_improvement
            },
            "annual_savings_total_usd": round(leak_repair_savings + annual_solar_savings_usd, 2)
        }
