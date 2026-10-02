import { supabase } from "../lib/supabase";

async function getAuthenticatedUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("Sign in to access your Farm Diary.");
  return user;
}

function mapDiaryEntry(row) {
  return {
    id: row.id,
    date: row.entry_date,
    title: row.title,
    note: row.note,
    expense: Number(row.expense),
    tag: row.tag,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    persisted: true,
  };
}

export async function getMyDiaryEntries() {
  const user = await getAuthenticatedUser();
  const { data, error } = await supabase
    .from("farm_diary_entries")
    .select("id, entry_date, title, note, expense, tag, created_at, updated_at")
    .eq("user_id", user.id)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapDiaryEntry);
}

export async function createMyDiaryEntry(entry) {
  const user = await getAuthenticatedUser();
  const { data, error } = await supabase
    .from("farm_diary_entries")
    .insert({
      user_id: user.id,
      entry_date: entry.date,
      title: entry.title,
      note: entry.note || "",
      expense: entry.expense ?? 0,
      tag: entry.tag,
    })
    .select("id, entry_date, title, note, expense, tag, created_at, updated_at")
    .single();

  if (error) throw error;
  return mapDiaryEntry(data);
}

export async function updateMyDiaryEntry(entryId, changes) {
  const user = await getAuthenticatedUser();
  const updates = {};
  if (changes.title !== undefined) updates.title = changes.title;
  if (changes.note !== undefined) updates.note = changes.note;
  if (changes.tag !== undefined) updates.tag = changes.tag;
  if (changes.date !== undefined) updates.entry_date = changes.date;
  if (changes.expense !== undefined) updates.expense = changes.expense;

  const { data, error } = await supabase
    .from("farm_diary_entries")
    .update(updates)
    .eq("id", entryId)
    .eq("user_id", user.id)
    .select("id, entry_date, title, note, expense, tag, created_at, updated_at")
    .single();

  if (error) throw error;
  return mapDiaryEntry(data);
}

export async function deleteMyDiaryEntry(entryId) {
  const user = await getAuthenticatedUser();
  const { error } = await supabase
    .from("farm_diary_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (error) throw error;
}
