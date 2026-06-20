"use client";

import React from "react";
import { ThemeProvider } from "../lib/providers/ThemeProvider";
import { ReactQueryProvider } from "../lib/providers/ReactQueryProvider";
import { ToastProvider } from "../lib/providers/ToastProvider";
import { AuthProvider } from "../lib/providers/AuthProvider";
import { RoleProvider } from "../lib/providers/RoleProvider";
import { CarbonProvider } from "../lib/providers/CarbonProvider";
import { TelemetryProvider } from "../lib/providers/TelemetryProvider";
import { GoogleMapsProvider } from "../lib/providers/GoogleMapsProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <ToastProvider>
        <AuthProvider>
          <RoleProvider>
            <CarbonProvider>
              <TelemetryProvider>
                <GoogleMapsProvider>
                  <ThemeProvider>
                    {children}
                  </ThemeProvider>
                </GoogleMapsProvider>
              </TelemetryProvider>
            </CarbonProvider>
          </RoleProvider>
        </AuthProvider>
      </ToastProvider>
    </ReactQueryProvider>
  );
};
