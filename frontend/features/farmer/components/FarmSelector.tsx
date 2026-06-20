"use client";

import React from "react";

interface FieldOption {
  id: string;
  name: string;
  crop_type: string;
  acreage: number;
}

interface FarmSelectorProps {
  fields: FieldOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const FarmSelector: React.FC<FarmSelectorProps> = ({
  fields,
  selectedId,
  onSelect,
  className = ""
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor="farm-field-select" className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
        Active Land Parcel
      </label>
      <select
        id="farm-field-select"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full bg-white border border-border px-4 py-2.5 rounded-xl text-xs font-bold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20 cursor-pointer shadow-sm"
      >
        {fields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name} ({f.acreage} acres)
          </option>
        ))}
      </select>
    </div>
  );
};
export default FarmSelector;
