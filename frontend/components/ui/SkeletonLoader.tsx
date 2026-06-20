"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ className = "", variant = "rectangular" }) => {
  const getShapeClass = () => {
    switch (variant) {
      case "text": return "h-3 w-3/4 rounded";
      case "circular": return "rounded-full";
      default: return "rounded-lg";
    }
  };

  return (
    <div
      className={`animate-pulse bg-[#DCEED2]/40 ${getShapeClass()} ${className}`}
      aria-hidden="true"
    />
  );
};
export default SkeletonLoader;
