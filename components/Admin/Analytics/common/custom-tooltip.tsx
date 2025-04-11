"use client";

import { useTheme } from "next-themes";

// Define types for the tooltip props
export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

// Theme aware tooltip component that can be shared across chart components
export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  const { theme } = useTheme();

  if (active && payload && payload.length) {
    return (
      <div
        className={`p-3 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
      >
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
} 