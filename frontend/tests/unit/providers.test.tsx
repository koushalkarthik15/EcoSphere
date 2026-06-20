import React from "react";
import { renderHook, act } from "@testing-library/react";
import { CarbonProvider, useCarbon } from "../../lib/providers/CarbonProvider";
import { ToastProvider } from "../../lib/providers/ToastProvider";

// Test suite for Carbon Provider state management
describe("CarbonProvider Context State", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>
      <CarbonProvider>{children}</CarbonProvider>
    </ToastProvider>
  );

  it("should initialize with default EcoCredits and EcoCoins balances", () => {
    const { result } = renderHook(() => useCarbon(), { wrapper });

    expect(result.current.carbonBalance).toBe(120.5);
    expect(result.current.marketplaceBalance).toBe(2500);
  });

  it("should correctly update balance states on add/spend operations", () => {
    const { result } = renderHook(() => useCarbon(), { wrapper });

    act(() => {
      result.current.addCredits(10);
      result.current.addCoins(500);
    });

    expect(result.current.carbonBalance).toBe(130.5);
    expect(result.current.marketplaceBalance).toBe(3000);
  });

  it("should prevent spending more EcoCoins than available", () => {
    const { result } = renderHook(() => useCarbon(), { wrapper });

    let success = false;
    act(() => {
      success = result.current.spendCoins(3000); // Exceeds 2500 default
    });

    expect(success).toBe(false);
    expect(result.current.marketplaceBalance).toBe(2500);
  });

  it("should process valid credit offset purchase transactions", async () => {
    const { result } = renderHook(() => useCarbon(), { wrapper });

    let success = false;
    await act(async () => {
      success = await result.current.purchaseCredits(10, 500); // 10 credits for 500 coins
    });

    expect(success).toBe(true);
    expect(result.current.carbonBalance).toBe(130.5);
    expect(result.current.marketplaceBalance).toBe(2000);
  });
});
