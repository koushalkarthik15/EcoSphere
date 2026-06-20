from typing import Dict, Any, List, Optional
from datetime import datetime

class WalletService:
    """
    Maintains EcoCredits, EcoCoins, purchased offset certificates, and handles balance conversions.
    """

    def __init__(self):
        # Simulated wallets database mapping user profiles
        self.wallets = {
            "default_user": {
                "eco_credits_tons": 120.5,
                "eco_coins": 2500,
                "purchased_credits_tons": 20.0,
                "verified_credits_tons": 0.0,
                "ncm_balance_usd": 15000.0,
                "ledger_history": [
                    {"id": "ledger_0", "type": "challenge_reward", "amount": 100, "desc": "Completed challenge: Green Commute Pioneer", "timestamp": "2026-06-18T11:00:00Z"},
                    {"id": "ledger_1", "type": "credits_conversion", "amount": 500, "desc": "Converted 5.0 EcoCredits into EcoCoins", "timestamp": "2026-06-17T09:15:00Z"}
                ]
            }
        }

    def get_wallet(self, user_id: str) -> Dict[str, Any]:
        if user_id not in self.wallets:
            # Initialize default
            self.wallets[user_id] = {
                "eco_credits_tons": 0.0,
                "eco_coins": 1000,
                "purchased_credits_tons": 0.0,
                "verified_credits_tons": 0.0,
                "ncm_balance_usd": 5000.0,
                "ledger_history": []
            }
        return self.wallets[user_id]

    def convert_credits_to_coins(
        self,
        user_id: str,
        credits_to_convert: float
    ) -> Dict[str, Any]:
        """
        Converts saved environmental credits into spendable marketplace EcoCoins.
        Rate: 1 ton offset = 100 EcoCoins.
        """
        wallet = self.get_wallet(user_id)
        if wallet["eco_credits_tons"] < credits_to_convert:
            raise ValueError("Insufficient EcoCredits balance for conversion")

        coins_added = int(credits_to_convert * 100)
        wallet["eco_credits_tons"] = round(wallet["eco_credits_tons"] - credits_to_convert, 1)
        wallet["eco_coins"] += coins_added

        tx = {
            "id": f"ledger_{datetime.now().strftime('%f')[:6]}",
            "type": "credits_conversion",
            "amount": coins_added,
            "desc": f"Converted {credits_to_convert} EcoCredits into spendable EcoCoins",
            "timestamp": datetime.now().isoformat() + "Z"
        }
        wallet["ledger_history"].insert(0, tx)
        return wallet

    def receive_payment_for_sell(
        self,
        user_id: str,
        volume_tons: float,
        price_per_ton: float
    ) -> Dict[str, Any]:
        wallet = self.get_wallet(user_id)
        coins_earned = int(volume_tons * price_per_ton)
        
        wallet["eco_coins"] += coins_earned
        wallet["verified_credits_tons"] = max(0.0, round(wallet["verified_credits_tons"] - volume_tons, 1))

        tx = {
            "id": f"ledger_{datetime.now().strftime('%f')[:6]}",
            "type": "credits_sold",
            "amount": coins_earned,
            "desc": f"Sold {volume_tons} verified carbon credits in marketplace",
            "timestamp": datetime.now().isoformat() + "Z"
        }
        wallet["ledger_history"].insert(0, tx)
        return wallet

    def deduct_payment_for_buy(
        self,
        user_id: str,
        volume_tons: float,
        price_per_ton: float
    ) -> Dict[str, Any]:
        wallet = self.get_wallet(user_id)
        total_cost = int(volume_tons * price_per_ton)

        if wallet["eco_coins"] < total_cost:
            raise ValueError("Insufficient EcoCoins balance to purchase carbon credits")

        wallet["eco_coins"] -= total_cost
        wallet["purchased_credits_tons"] = round(wallet["purchased_credits_tons"] + volume_tons, 1)

        tx = {
            "id": f"ledger_{datetime.now().strftime('%f')[:6]}",
            "type": "credits_purchased",
            "amount": -total_cost,
            "desc": f"Purchased {volume_tons} carbon offset credits from listing",
            "timestamp": datetime.now().isoformat() + "Z"
        }
        wallet["ledger_history"].insert(0, tx)
        return wallet
