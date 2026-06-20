"use client";

import React from "react";

interface CardProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, className = "", children }) => {
  return (
    <div className={`bg-white border border-border p-6 rounded-2xl shadow-sm transition-smooth hover:shadow-md ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="font-display text-md font-bold text-text-deep tracking-tight">{title}</h3>}
          {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
        </div>
      )}
      <div className="text-xs text-text-deep leading-relaxed">
        {children}
      </div>
    </div>
  );
};
export default Card;
