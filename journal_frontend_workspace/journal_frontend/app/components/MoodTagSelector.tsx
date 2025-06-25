import React from "react";
import type { Mood } from "../utils/api";

interface MoodTagSelectorProps {
  availableMoods: Mood[];
  value?: Mood;
  onChange: (mood: Mood) => void;
}

// PUBLIC_INTERFACE
export function MoodTagSelector({
  availableMoods,
  value,
  onChange,
}: MoodTagSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {availableMoods.map((mood) => (
        <button
          key={mood}
          type="button"
          className={`px-2 py-1 rounded text-xs ${
            value === mood
              ? "bg-primary text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          }`}
          onClick={() => onChange(mood)}
        >
          {mood}
        </button>
      ))}
    </div>
  );
}
