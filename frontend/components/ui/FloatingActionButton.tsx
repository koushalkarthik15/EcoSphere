"use client";

import React from "react";

interface FABProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  className?: string;
}

export const FloatingActionButton: React.FC<FABProps> = ({
  onClick,
  icon,
  label = "Quick Action",
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-30 p-4 bg-text-deep text-white rounded-full shadow-2xl hover:scale-105 transition-smooth flex items-center justify-center border border-border focus:ring-4 focus:ring-text-deep/20 ${className}`}
      aria-label={label}
    >
      {icon}
    </button>
  );
};
export default FloatingActionButton;
