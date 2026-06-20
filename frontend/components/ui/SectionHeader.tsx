"use client";

import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actions,
  className = ""
}) => {
  return (
    <div className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-4 ${className}`}>
      <div>
        <h2 className="font-display text-xl font-black text-text-deep tracking-tight">{title}</h2>
        {description && <p className="text-xs text-text-muted mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};
export default SectionHeader;
