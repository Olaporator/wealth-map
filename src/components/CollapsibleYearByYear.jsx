import React, { useState } from 'react';

/**
 * Reusable collapsible year-by-year projection table.
 *
 * Props:
 *   title    – section heading (default "Year-by-Year Projection")
 *   children – the <table> (or any content) to show/hide
 *   defaultOpen – whether the section starts expanded (default false)
 */
export default function CollapsibleYearByYear({ title = 'Year-by-Year Projection', children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg mb-8 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800/50 transition-colors"
      >
        <h2 className="text-xl font-bold">{title}</h2>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-6 overflow-x-auto">
          {children}
        </div>
      )}
    </div>
  );
}
