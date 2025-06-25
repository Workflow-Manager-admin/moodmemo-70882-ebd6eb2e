import { useState } from "react";
import { marked } from "marked";

// PUBLIC_INTERFACE
export default function MarkdownEditor({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  // Count words (simple split on whitespace)
  const wordCount = value.trim().length > 0 ? value.trim().split(/\s+/).length : 0;

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          className={`px-3 py-1 rounded-t ${
            tab === "edit" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-800"
          }`}
          onClick={() => setTab("edit")}
        >
          Edit
        </button>
        <button
          className={`px-3 py-1 rounded-t ${
            tab === "preview" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-800"
          }`}
          onClick={() => setTab("preview")}
        >
          Preview
        </button>
      </div>
      {tab === "edit" ? (
        <textarea
          className="w-full h-48 border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 focus:outline-primary"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      ) : (
        <div className="prose bg-gray-50 max-w-none dark:bg-gray-900 dark:text-gray-100 border border-gray-300 rounded p-3 min-h-[10rem] overflow-auto"
          dangerouslySetInnerHTML={{ __html: marked.parse(value || "") }}
        />
      )}
      <div className="mt-1 text-xs text-gray-500">{wordCount} word{wordCount !== 1 ? "s" : ""}</div>
    </div>
  );
}
