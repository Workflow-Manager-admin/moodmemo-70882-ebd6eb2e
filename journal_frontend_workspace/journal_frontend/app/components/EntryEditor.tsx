import { useState } from "react";
import type { Mood, EntryDetail } from "../utils/api";
import MarkdownEditor from "./MarkdownEditor";
import { MoodTagSelector } from "./MoodTagSelector";

// PUBLIC_INTERFACE
export default function EntryEditor({
  entry,
  onSave,
  onCancel,
  isSaving,
  availableMoods,
}: {
  entry?: EntryDetail;
  onSave: (data: {
    title: string;
    content: string;
    date: string;
    mood?: Mood;
    tags?: string[];
  }) => void;
  onCancel: () => void;
  isSaving?: boolean;
  availableMoods: Mood[];
}) {
  const [title, setTitle] = useState(entry?.title || "");
  const [date, setDate] = useState(entry?.date || new Date().toISOString().substr(0, 10));
  const [content, setContent] = useState(entry?.content || "");
  const [mood, setMood] = useState<Mood | undefined>(entry?.mood || undefined);

  return (
    <form
      className="p-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, content, date, mood });
      }}
    >
      <div>
        <label htmlFor="journal-title" className="block text-xs font-bold mb-1">Title</label>
        <input
          className="w-full px-2 py-1 border rounded text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          id="journal-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSaving}
          maxLength={100}
        />
      </div>
      <div>
        <label htmlFor="journal-date" className="block text-xs font-bold mb-1">Date</label>
        <input
          type="date"
          id="journal-date"
          className="w-full px-2 py-1 border rounded text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={isSaving}
        />
      </div>
      <div>
        <label htmlFor="journal-content" className="block text-xs font-bold mb-1">Content (Markdown)</label>
        <MarkdownEditor value={content} onChange={setContent} disabled={isSaving} />
      </div>
      <div>
        <label htmlFor="journal-mood" className="block text-xs font-bold mb-1">Mood</label>
        <MoodTagSelector
          availableMoods={availableMoods}
          value={mood}
          onChange={setMood}
        />
      </div>
      <div className="flex mt-2 gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-1 bg-primary text-white rounded"
        >
          {isSaving ? "Saving..." : entry ? "Save" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
