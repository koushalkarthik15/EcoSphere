"use client";

import React from "react";
import { LucideLeaf } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Loading environmental intelligence data..." }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh] gap-4 p-6">
      <div className="bg-[#DAEED2] p-4 rounded-full animate-bounce">
        <LucideLeaf className="h-8 w-8 text-text-deep animate-spin" />
      </div>
      <p className="text-xs text-text-muted font-semibold tracking-wide">{message}</p>
    </div>
  );
};
export default LoadingScreen;
