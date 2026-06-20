"use client";

import React from "react";

interface HistoryItem {
  period: string;
  sustainability_score: number;
  aqi: number;
  carbon_sink: number;
}

interface TrendChartProps {
  data: HistoryItem[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-border p-6 rounded-2xl text-center text-xs text-text-muted">
        No historical trends logged.
      </div>
    );
  }

  // Find max value to scale columns properly
  const maxVal = 100;

  return (
    <div 
      className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4"
      role="region"
      aria-label="Historical ESG Trend Chart"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-display text-sm font-bold text-text-deep tracking-tight">
            📈 Historical ESG Indices
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5">
            Quarterly performance timeline of sustainability ratings
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-3 text-[9px] font-bold text-text-muted">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-text-deep" />
            <span>Sustainability</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-telemetry-healthy" />
            <span>Carbon Sink</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-telemetry-warning" />
            <span>AQI</span>
          </div>
        </div>
      </div>

      {/* Columns wrapper */}
      <div className="h-48 flex items-end justify-between gap-2 border-b border-border pb-2 pt-4">
        {data.map((item, index) => {
          const sustainHeight = (item.sustainability_score / maxVal) * 100;
          const sinkHeight = (item.carbon_sink / maxVal) * 100;
          const aqiHeight = (item.aqi / maxVal) * 100;

          return (
            <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end">
              {/* Bars container */}
              <div className="w-full flex items-end justify-center gap-1 h-full max-w-[50px]">
                {/* Sustainability Bar */}
                <div 
                  className="w-2 bg-text-deep rounded-t-sm transition-all duration-700 ease-out hover:brightness-110 relative"
                  style={{ height: `${sustainHeight}%` }}
                  title={`Sustainability: ${item.sustainability_score}`}
                >
                  <span className="sr-only">Sustainability {item.sustainability_score}</span>
                </div>

                {/* Carbon Sink Bar */}
                <div 
                  className="w-2 bg-telemetry-healthy rounded-t-sm transition-all duration-700 ease-out hover:brightness-110 relative"
                  style={{ height: `${sinkHeight}%` }}
                  title={`Carbon Sink: ${item.carbon_sink}`}
                >
                  <span className="sr-only">Carbon Sink {item.carbon_sink}</span>
                </div>

                {/* AQI Bar */}
                <div 
                  className="w-2 bg-telemetry-warning rounded-t-sm transition-all duration-700 ease-out hover:brightness-110 relative"
                  style={{ height: `${aqiHeight}%` }}
                  title={`AQI: ${item.aqi}`}
                >
                  <span className="sr-only">AQI {item.aqi}</span>
                </div>
              </div>

              {/* X Axis Label */}
              <span className="text-[9px] font-bold text-text-muted mt-2 block">
                {item.period}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendChart;
