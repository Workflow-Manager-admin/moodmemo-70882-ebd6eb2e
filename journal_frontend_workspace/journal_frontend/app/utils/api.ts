//
// UTILITY: Backend API interaction layer for journal entries
//

const API_BASE = process.env.JOURNAL_API_URL || "http://localhost:3001/api";

/**
 * Types based on anticipated OpenAPI spec for journal entries and analytics.
 * Backend types should be updated/improved if the OpenAPI spec is more specific.
 */
export type Mood =
  | "happy"
  | "sad"
  | "neutral"
  | "excited"
  | "tired"
  | "angry"
  | "anxious"
  | "proud"
  | string;

export interface EntrySummary {
  id: string;
  title: string;
  date: string; // ISO string
  mood?: Mood;
  wordCount: number;
}

/**
 * EntryDetail now extends EntrySummary and adds 'content' and optionally 'tags'.
 * The 'title' property is present and required everywhere for entries.
 */
export interface EntryDetail extends EntrySummary {
  content: string; // Markdown
  tags?: string[];
}

export interface AnalyticsData {
  moods: Record<Mood, number>;
  wordCountByDate: Record<string, number>;
  entryCount: number;
  // Extend with more analytics as needed
}

export interface SearchParams {
  text?: string;
  mood?: Mood;
  fromDate?: string; // ISO
  toDate?: string;   // ISO
}

/**
 * Helper to handle fetch and error conversion.
 * Also ensures error text is included in thrown message.
 */
async function apiFetch<T>(
  endpoint: string,
  opts: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  if (!response.ok) {
    throw new Error(
      `API error (${response.status}): ${await response.text()}`
    );
  }
  return response.json();
}

/**
 * List all journal entries (summaries).
 * Includes 'title' field, properly mapped.
 */
// PUBLIC_INTERFACE
export async function listEntries(
  search?: SearchParams
): Promise<EntrySummary[]> {
  const q: string[] = [];
  if (search?.text) q.push(`text=${encodeURIComponent(search.text)}`);
  if (search?.mood) q.push(`mood=${encodeURIComponent(search.mood)}`);
  if (search?.fromDate) q.push(`fromDate=${encodeURIComponent(search.fromDate)}`);
  if (search?.toDate) q.push(`toDate=${encodeURIComponent(search.toDate)}`);
  const query = q.length ? `?${q.join("&")}` : "";
  return apiFetch<EntrySummary[]>(`/entries${query}`);
}

/**
 * Get details for a single journal entry, with 'title' and 'content'.
 */
// PUBLIC_INTERFACE
export async function getEntry(id: string): Promise<EntryDetail> {
  return apiFetch<EntryDetail>(`/entries/${id}`);
}

/**
 * Create a journal entry.
 * Must include 'title', 'content', 'date'. Mood and tags are optional.
 */
// PUBLIC_INTERFACE
export async function createEntry(entry: {
  title: string;
  content: string;
  date: string;
  mood?: Mood;
  tags?: string[];
}): Promise<EntryDetail> {
  return apiFetch<EntryDetail>(`/entries`, {
    method: "POST",
    body: JSON.stringify(entry)
  });
}

/**
 * Update a journal entry.
 * Supports updating 'title', 'content', 'date', and optional 'mood'/'tags'.
 */
// PUBLIC_INTERFACE
export async function updateEntry(
  id: string, 
  entry: {
    title?: string;
    content?: string;
    date?: string;
    mood?: Mood;
    tags?: string[];
  }
): Promise<EntryDetail> {
  return apiFetch<EntryDetail>(`/entries/${id}`, {
    method: "PUT",
    body: JSON.stringify(entry)
  });
}

/**
 * Delete a journal entry by id.
 */
// PUBLIC_INTERFACE
export async function deleteEntry(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/entries/${id}`, {
    method: "DELETE"
  });
}

/**
 * Fetch analytics about journal entries.
 */
// PUBLIC_INTERFACE
export async function getAnalytics(): Promise<AnalyticsData> {
  return apiFetch<AnalyticsData>("/analytics");
}
