import React from 'react';

/**
 * Reusable age slider for selecting a target year across all dashboards.
 *
 * Props:
 *   age        – current selected age (number)
 *   onChange   – callback when age changes: (newAge) => void
 *   min        – minimum age (default 31)
 *   max        – maximum age (default 60)
 */
export default function AgeSlider({ age, onChange, min = 31, max = 60 }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
      <div className="flex flex-wrap gap-6 items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-semibold text-sm">Target Age:</span>
          <input
            type="range"
            min={min}
            max={max}
            value={age}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-48 accent-emerald-400"
          />
          <span className="text-3xl font-bold text-emerald-400 w-12">{age}</span>
        </div>
      </div>
    </div>
  );
}
