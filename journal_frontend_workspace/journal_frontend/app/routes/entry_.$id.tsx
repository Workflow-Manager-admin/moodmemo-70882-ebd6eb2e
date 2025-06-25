import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getEntry, deleteEntry, type EntryDetail } from "~/utils/api";

// PUBLIC_INTERFACE
export const meta: MetaFunction = ({ data }: { data?: { entry?: EntryDetail } }) => {
  return [
    { title: data?.entry ? `MoodMemo – ${data.entry.title}` : "MoodMemo – View Entry" }
  ];
};

// PUBLIC_INTERFACE
export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) throw new Response("Not Found", { status: 404 });
  const entry = await getEntry(params.id);
  return json({ entry });
}

// PUBLIC_INTERFACE
export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method === "DELETE" && params.id) {
    await deleteEntry(params.id);
    return redirect("/");
  }
  return new Response("Method Not Allowed", { status: 405 });
}

// UI component for entry detail page
export default function EntryDetailPage() {
  const { entry } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{entry.title}</h1>
        <div>
          <button
            className="text-xs px-3 py-1 rounded bg-secondary text-white mr-2"
            onClick={() => navigate(`/entry/${entry.id}/edit`)}
          >
            Edit
          </button>
          <button
            className="text-xs px-3 py-1 rounded bg-red-600 text-white"
            onClick={async () => {
              if (window.confirm("Delete this entry?")) {
                await fetch(`/entry/${entry.id}`, { method: "DELETE" });
                navigate("/");
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-2 text-gray-500 text-sm">
        {entry.date} · {entry.mood && <span>Mood: {entry.mood} · </span>}
        {entry.wordCount} words
      </div>
      <div className="prose dark:prose-invert mt-6" dangerouslySetInnerHTML={{ __html: (window as unknown as { marked?: { parse: (input: string) => string } }).marked ? (window as unknown as { marked: { parse: (input: string) => string } }).marked.parse(entry.content) : entry.content }} />
    </div>
  );
}
