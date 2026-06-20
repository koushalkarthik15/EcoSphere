"use client";

import React from "react";

interface FacilityOption {
  id: string;
  name: string;
  registry_id: string;
}

interface FacilitySelectorProps {
  facilities: FacilityOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const FacilitySelector: React.FC<FacilitySelectorProps> = ({
  facilities,
  selectedId,
  onSelect,
  className = ""
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor="facility-select" className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
        Active Facility Site
      </label>
      <select
        id="facility-select"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full bg-white border border-border px-4 py-2.5 rounded-xl text-xs font-bold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20 cursor-pointer shadow-sm"
      >
        {facilities.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name} ({f.registry_id})
          </option>
        ))}
      </select>
    </div>
  );
};

export default FacilitySelector;
