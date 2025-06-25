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
  return apiFetch(`/entries${query}`);
}

// PUBLIC_INTERFACE
export async function getEntry(id: string): Promise<EntryDetail> {
  return apiFetch(`/entries/${id}`);
}

// PUBLIC_INTERFACE
export async function createEntry(entry: {
  title: string;
  content: string;
  date: string;
  mood?: Mood;
  tags?: string[];
}): Promise<EntryDetail> {
  return apiFetch(`/entries`, {
    method: "POST",
    body: JSON.stringify(entry)
  });
}

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
  return apiFetch(`/entries/${id}`, {
    method: "PUT",
    body: JSON.stringify(entry)
  });
}

// PUBLIC_INTERFACE
export async function deleteEntry(id: string): Promise<{ success: boolean }> {
  return apiFetch(`/entries/${id}`, {
    method: "DELETE"
  });
}

// PUBLIC_INTERFACE
export async function getAnalytics(): Promise<AnalyticsData> {
  return apiFetch("/analytics");
}
