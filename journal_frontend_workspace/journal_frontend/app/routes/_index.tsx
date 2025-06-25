import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import Sidebar from "~/components/Sidebar";
import EntryCard from "~/components/EntryCard";
import SearchBar from "~/components/SearchBar";
import { listEntries, type EntrySummary, type Mood } from "~/utils/api";

/**
 * Loader for fetching entries list based on search/query params.
 */
export const meta: MetaFunction = () => ([
  { title: "MoodMemo – Your Journal" },
  { name: "description", content: "Minimal, modern journal app with mood tagging and Markdown." },
]);

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const text = url.searchParams.get("text") ?? undefined;
  const mood = url.searchParams.get("mood") ?? undefined;
  // Filtering by date can be added as needed.
  const entries = await listEntries({ text, mood });
  // Hardcode available moods here, or fetch from backend/analytics.
  const moods: Mood[] = ["happy", "sad", "neutral", "excited", "tired", "angry", "anxious", "proud"];
  return json({ entries, moods });
}

export default function JournalListPage() {
  const { entries, moods } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>(
    searchParams.get("mood") as Mood | undefined
  );

  const handleSearch = (text: string) => {
    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      if (text) sp.set("text", text);
      else sp.delete("text");
      return sp;
    });
  };

  const handleSelectMood = (mood: Mood | undefined) => {
    setSelectedMood(mood);
    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      if (mood) sp.set("mood", mood);
      else sp.delete("mood");
      return sp;
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar moods={moods} selectedMood={selectedMood} onSelectMood={handleSelectMood} />
      <main className="flex-1 flex flex-col overflow-y-auto bg-white dark:bg-gray-950">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80">
          <h1 className="text-xl font-bold mb-2">Journal Entries</h1>
          <SearchBar
            initialText={searchParams.get("text") || ""}
            onSearch={handleSearch}
            placeholder="Search entries..."
          />
        </div>
        <section className="p-6 overflow-y-auto h-full">
          <button
            className="mb-4 px-4 py-2 rounded bg-primary text-white"
            onClick={() => navigate("/new")}
          >
            + New Entry
          </button>
          <div>
            {entries?.length === 0 ? (
              <div className="text-gray-400 text-center">No journal entries found.</div>
            ) : (
              entries.map((entry: EntrySummary) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onClick={() => navigate(`/entry/${entry.id}`)}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
