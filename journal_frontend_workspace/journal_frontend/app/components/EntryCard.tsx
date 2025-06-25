import type { EntrySummary } from "../utils/api";

type Props = {
  entry: EntrySummary;
  selected?: boolean;
  onClick?: () => void;
};

export default function EntryCard({ entry, selected, onClick }: Props) {
  return (
    <button
      className={`block text-left w-full rounded border px-4 py-2 my-2 shadow-sm transition ${
        selected
          ? "bg-primary/90 text-white border-primary"
          : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 hover:bg-secondary/5"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-row items-center justify-between">
        <div>
          <div className="font-medium text-base truncate">{entry.title}</div>
          <div className="text-xs text-gray-400">
            {entry.date} ·
            {entry.mood ? ` ${entry.mood} ·` : ""}
            {entry.wordCount} words
          </div>
        </div>
      </div>
    </button>
  );
}
