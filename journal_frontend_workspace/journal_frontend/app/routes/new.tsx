import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import EntryEditor from "~/components/EntryEditor";
import { createEntry, type Mood } from "~/utils/api";
import { useState } from "react";

// PUBLIC_INTERFACE
export const meta: MetaFunction = () => [{ title: "MoodMemo – New Entry" }];

// PUBLIC_INTERFACE
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    date: formData.get("date") as string,
    mood: formData.get("mood") as Mood | undefined
  };
  const entry = await createEntry(data);
  return redirect(`/entry/${entry.id}`);
}

// UI for create new journal entry
export default function NewEntryPage() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const availableMoods: Mood[] = [
    "happy", "sad", "neutral", "excited", "tired", "angry", "anxious", "proud"
  ];

  async function handleSave(data: { title: string; content: string; date: string; mood?: Mood }) {
    setIsSaving(true);
    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value) form.append(key, value);
    }
    await fetch("/new", { method: "POST", body: form });
    setIsSaving(false);
    navigate("/");
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">New Journal Entry</h2>
      <EntryEditor
        availableMoods={availableMoods}
        onCancel={() => navigate("/")}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
