import { useState } from "react";

type Props = {
  initialText?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({ initialText = "", onSearch, placeholder }: Props) {
  const [text, setText] = useState(initialText);

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(text);
      }}
    >
      <input
        type="text"
        className="w-full px-2 py-1 border rounded text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        placeholder={placeholder || "Search..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="px-4 py-1 bg-primary text-white rounded">
        Search
      </button>
    </form>
  );
}
