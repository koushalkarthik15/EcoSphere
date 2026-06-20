"use client";

import React from "react";
import { LucideSearch, LucideSlidersHorizontal } from "lucide-react";

interface MarketplaceFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  selectedRating: string;
  onRatingChange: (val: string) => void;
  className?: string;
}

export const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedRating,
  onRatingChange,
  className = ""
}) => {
  return (
    <div className={`bg-white border border-border p-4.5 rounded-2xl shadow-xs flex flex-col md:flex-row items-center gap-4 ${className}`}>
      
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
          <LucideSearch className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects or listings..."
          className="w-full bg-[#F1F8E9]/50 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20 placeholder-text-muted shadow-2xs"
        />
      </div>

      {/* Project Type Filter */}
      <div className="w-full md:w-44 flex flex-col gap-1.5">
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full bg-white border border-border px-3.5 py-2.5 rounded-xl text-xs font-bold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20 cursor-pointer shadow-2xs"
        >
          <option value="">All Categories</option>
          <option value="soil">Soil Sequestration</option>
          <option value="solar">Solar Energy</option>
          <option value="afforestation">Afforestation</option>
        </select>
      </div>

      {/* Grade Quality Filter */}
      <div className="w-full md:w-44 flex flex-col gap-1.5">
        <select
          value={selectedRating}
          onChange={(e) => onRatingChange(e.target.value)}
          className="w-full bg-white border border-border px-3.5 py-2.5 rounded-xl text-xs font-bold text-text-deep focus:outline-none focus:ring-2 focus:ring-text-deep/20 cursor-pointer shadow-2xs"
        >
          <option value="">All Quality Grades</option>
          <option value="A++">Grade A++</option>
          <option value="A+">Grade A+</option>
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
        </select>
      </div>

    </div>
  );
};

export default MarketplaceFilters;
