import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getEntry, updateEntry, type EntryDetail, type Mood } from "~/utils/api";
import EntryEditor from "~/components/EntryEditor";
import { useState } from "react";

// PUBLIC_INTERFACE
export const meta: MetaFunction = ({ data }: { data?: { entry?: EntryDetail } }) => [
  { title: data?.entry ? `Edit – ${data.entry.title}` : "Edit Journal Entry" }
];

// PUBLIC_INTERFACE
export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) throw new Response("Not Found", { status: 404 });
  const entry = await getEntry(params.id);
  return json({ entry });
}

// PUBLIC_INTERFACE
export async function action({ request, params }: ActionFunctionArgs) {
  if (!params.id) throw new Response("Not Found", { status: 404 });
  const formData = await request.formData();
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    date: formData.get("date") as string,
    mood: formData.get("mood") as Mood | undefined
  };
  await updateEntry(params.id, data);
  return redirect(`/entry/${params.id}`);
}

export default function EditEntryPage() {
  const { entry } = useLoaderData<typeof loader>();
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
    await fetch(`/entry/${entry.id}/edit`, { method: "POST", body: form });
    setIsSaving(false);
    navigate(`/entry/${entry.id}`);
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Edit Entry</h2>
      <EntryEditor
        entry={entry}
        availableMoods={availableMoods}
        onCancel={() => navigate(`/entry/${entry.id}`)}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
