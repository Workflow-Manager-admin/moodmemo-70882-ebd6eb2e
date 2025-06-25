import type { Mood } from "../utils/api";

// Sidebar navigation by date, mood/tags

type SidebarProps = {
  moods: Mood[];
  selectedMood?: Mood;
  onSelectMood?: (mood: Mood | undefined) => void;
  dates?: string[];
  onSelectDate?: (date: string) => void;
  selectedDate?: string;
};

export default function Sidebar({
  moods,
  selectedMood,
  onSelectMood,
  dates,
  selectedDate,
  onSelectDate,
}: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 pt-4 px-2 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">Moods</h3>
        <div className="flex flex-wrap gap-1">
          <button
            className={`px-2 py-1 rounded text-xs ${
              !selectedMood
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            }`}
            onClick={() => onSelectMood?.(undefined)}
          >
            All
          </button>
          {moods.map((mood) => (
            <button
              key={mood}
              className={`px-2 py-1 rounded text-xs ${
                selectedMood === mood
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              }`}
              onClick={() => onSelectMood?.(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
      {dates && dates.length > 0 && (
        <div className="mt-7">
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3">Dates</h3>
          <ul className="space-y-1 overflow-y-auto max-h-[250px] custom-scrollbar">
            {dates.map((date) => (
              <li key={date}>
                <button
                  className={`block w-full text-left px-2 py-1 rounded text-xs ${
                    selectedDate === date
                      ? "bg-accent text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                  onClick={() => onSelectDate?.(date)}
                >
                  {date}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
