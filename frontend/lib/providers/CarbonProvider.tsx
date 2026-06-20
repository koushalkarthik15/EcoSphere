"use client";

import React, { createContext, useContext, useState } from "react";
import { useToasts } from "./ToastProvider";

interface CarbonContextType {
  carbonBalance: number;       // EcoCredits (Tons of CO2 offset)
  marketplaceBalance: number;  // EcoCoins (Currency to buy credits)
  addCredits: (val: number) => void;
  spendCredits: (val: number) => void;
  addCoins: (val: number) => void;
  spendCoins: (val: number) => boolean;
  purchaseCredits: (amount: number, coinCost: number) => Promise<boolean>;
}

const CarbonContext = createContext<CarbonContextType | undefined>(undefined);

export const CarbonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carbonBalance, setCarbonBalance] = useState(120.5); // Baseline EcoCredits
  const [marketplaceBalance, setMarketplaceBalance] = useState(2500); // Baseline EcoCoins
  const { addToast } = useToasts();

  const addCredits = (val: number) => setCarbonBalance((prev) => prev + val);
  const spendCredits = (val: number) => setCarbonBalance((prev) => Math.max(0, prev - val));
  
  const addCoins = (val: number) => setMarketplaceBalance((prev) => prev + val);
  
  const spendCoins = (val: number): boolean => {
    if (marketplaceBalance >= val) {
      setMarketplaceBalance((prev) => prev - val);
      return true;
    }
    return false;
  };

  const purchaseCredits = async (amount: number, coinCost: number): Promise<boolean> => {
    if (marketplaceBalance >= coinCost) {
      setMarketplaceBalance((prev) => prev - coinCost);
      setCarbonBalance((prev) => prev + amount);
      addToast(
        `Successfully purchased ${amount} EcoCredits for ${coinCost} EcoCoins.`,
        "success",
        "Transaction Completed"
      );
      return true;
    }
    addToast(
      "Insufficient EcoCoins in marketplace account.",
      "error",
      "Transaction Failed"
    );
    return false;
  };

  return (
    <CarbonContext.Provider
      value={{
        carbonBalance,
        marketplaceBalance,
        addCredits,
        spendCredits,
        addCoins,
        spendCoins,
        purchaseCredits,
      }}
    >
      {children}
    </CarbonContext.Provider>
  );
};

export const useCarbon = () => {
  const context = useContext(CarbonContext);
  if (!context) {
    throw new Error("useCarbon must be used within a CarbonProvider");
  }
  return context;
};
