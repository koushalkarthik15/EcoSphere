import pytest
from app.services.marketplace_service import MarketplaceService
from app.services.pricing_engine import CarbonCreditPricingEngine
from app.services.wallet_service import WalletService

def test_marketplace_service_listings_and_transactions():
    service = MarketplaceService()
    initial_count = len(service.listings)

    # 1. Create a listing
    listing = service.create_listing(
        project_id="proj_punjab_tillage",
        seller_id="farmer_test",
        seller_name="Test Field A",
        volume=50.0,
        price_per_ton=16.5,
        quality_grade="A",
        vintage_year=2026,
        confidence=90.0
    )
    assert len(service.listings) == initial_count + 1
    assert listing["seller_name"] == "Test Field A"
    assert listing["volume_tons"] == 50.0
    assert listing["status"] == "AVAILABLE"

    # 2. Buy transaction execution
    tx = service.execute_transaction(
        listing_id=listing["id"],
        buyer_id="buyer_test",
        volume_tons=10.0
    )
    assert tx["status"] == "COMPLETED"
    assert tx["volume_tons"] == 10.0
    assert tx["total_price_coins"] == 165.0
    
    # Check that volume on listing decreased
    assert listing["volume_tons"] == 40.0


def test_pricing_engine_dynamic_rules():
    # Base check
    pricing_base = CarbonCreditPricingEngine.calculate_credit_price(
        supply_volume=500.0,
        demand_volume=500.0,
        quality_grade="A",
        verification_confidence=90.0,
        vintage_year=2025
    )
    # Base is 15.0. Quality grade 'A' = +5% -> 15.75.
    # Confidence 90.0/90.0 = 1.0. Vintage 2025 has no discount.
    # Estimated base price: ~15.75 coins per ton
    assert pricing_base["current_price_coins"] == 15.75

    # High demand / low supply check
    pricing_high_demand = CarbonCreditPricingEngine.calculate_credit_price(
        supply_volume=100.0,
        demand_volume=200.0, # demand ratio = 2.0 -> price multiplier = 1.25
        quality_grade="A++",  # A++ premium = +20% -> 1.20
        verification_confidence=99.0, # confidence = 99/90 = 1.10
        regional_priority=True, # regional priority = +10%
        vintage_year=2026     # vintage 2026 = +5%
    )
    # price should climb significantly
    assert pricing_high_demand["current_price_coins"] > 15.75

    # Vintage discount check
    pricing_old_vintage = CarbonCreditPricingEngine.calculate_credit_price(
        supply_volume=500.0,
        demand_volume=500.0,
        quality_grade="B",  # Grade B discount = -15% -> 0.85
        verification_confidence=90.0,
        vintage_year=2023   # Vintage 2023 discount = -10% -> 0.90
    )
    # price should drop significantly
    assert pricing_old_vintage["current_price_coins"] < 15.0


def test_wallet_service_conversions():
    w_service = WalletService()
    wallet = w_service.get_wallet("default_user")
    initial_credits = wallet["eco_credits_tons"]
    initial_coins = wallet["eco_coins"]

    # 1. Convert credits to coins
    # Let's say we convert 5.0 EcoCredits. We expect 500 EcoCoins added, 5.0 credits subtracted.
    w_service.convert_credits_to_coins("default_user", 5.0)
    assert wallet["eco_credits_tons"] == initial_credits - 5.0
    assert wallet["eco_coins"] == initial_coins + 500
    assert wallet["ledger_history"][0]["type"] == "credits_conversion"

    # 2. Insufficient credits check
    with pytest.raises(ValueError):
        w_service.convert_credits_to_coins("default_user", 99999.0)

    # 3. Spend coins for buy
    w_service.deduct_payment_for_buy("default_user", volume_tons=10.0, price_per_ton=15.0)
    assert wallet["eco_coins"] == initial_coins + 500 - 150
    assert wallet["purchased_credits_tons"] == 30.0

    # 4. Receive payment for sell
    wallet["verified_credits_tons"] = 15.0
    w_service.receive_payment_for_sell("default_user", volume_tons=5.0, price_per_ton=15.0)
    assert wallet["eco_coins"] == initial_coins + 500 - 150 + 75
    assert wallet["verified_credits_tons"] == 10.0
