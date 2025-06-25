import { useEffect, useState } from "react";
import { getAnalytics, type AnalyticsData } from "~/utils/api";

// Simple analytics display – mood and word counts.
export default function AnalyticsWidget() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    getAnalytics().then(setData);
  }, []);

  if (!data) return <div className="text-xs text-gray-300">Loading analytics...</div>;

  return (
    <div className="p-4 border rounded shadow bg-gray-50 dark:bg-gray-900 mb-4">
      <h3 className="font-semibold text-sm mb-2">Analytics Overview</h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="font-medium">Entries:</span> {data.entryCount}
        </div>
        <div>
          <span className="font-medium">Total Words:</span>{" "}
          {Object.values(data.wordCountByDate).reduce((a, b) => a + b, 0)}
        </div>
        <div>
          <span className="font-medium">Moods:</span>
          <ul>
            {Object.entries(data.moods).map(([mood, count]) => (
              <li key={mood}>
                {mood}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
