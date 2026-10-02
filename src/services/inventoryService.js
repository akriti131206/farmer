import { supabase } from "../lib/supabase";

function mapInventoryItem(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    stock: Number(row.stock),
    unit: row.unit,
    threshold: Number(row.threshold),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    persisted: true,
  };
}

async function getAuthenticatedUser(userId) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("Sign in to access your inventory.");

  if (userId && user.id !== userId) {
    throw new Error("You can only access your own inventory.");
  }

  return user;
}

export async function getInventoryItems(userId) {
  const user = await getAuthenticatedUser(userId);

  const { data, error } = await supabase
    .from("inventory_items")
    .select("id, user_id, name, category, stock, unit, threshold, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapInventoryItem);
}

export async function createInventoryItem(userId, item) {
  const user = await getAuthenticatedUser(userId);
  const payload = {
    user_id: user.id,
    name: item?.name?.trim() || "",
    category: item?.category || "seeds",
    stock: Number(item?.stock ?? 0),
    unit: item?.unit?.trim() || "units",
    threshold: Number(item?.threshold ?? 1),
  };

  if (!payload.name) {
    throw new Error("Inventory item name is required.");
  }

  if (!Number.isFinite(payload.stock) || payload.stock < 0) {
    throw new Error("Inventory stock cannot be negative.");
  }

  if (!Number.isFinite(payload.threshold) || payload.threshold <= 0) {
    throw new Error("Inventory threshold must be greater than zero.");
  }

  const { data, error } = await supabase
    .from("inventory_items")
    .insert(payload)
    .select("id, user_id, name, category, stock, unit, threshold, created_at, updated_at")
    .single();

  if (error) throw error;
  return mapInventoryItem(data);
}

export async function updateInventoryItem(userId, itemId, item) {
  const user = await getAuthenticatedUser(userId);
  const updates = {};

  if (item?.name !== undefined) updates.name = String(item.name).trim();
  if (item?.category !== undefined) updates.category = item.category;
  if (item?.stock !== undefined) updates.stock = Number(item.stock);
  if (item?.unit !== undefined) updates.unit = String(item.unit).trim();
  if (item?.threshold !== undefined) updates.threshold = Number(item.threshold);

  if (updates.name !== undefined && !updates.name) {
    throw new Error("Inventory item name is required.");
  }

  if (updates.stock !== undefined && (!Number.isFinite(updates.stock) || updates.stock < 0)) {
    throw new Error("Inventory stock cannot be negative.");
  }

  if (updates.threshold !== undefined && (!Number.isFinite(updates.threshold) || updates.threshold <= 0)) {
    throw new Error("Inventory threshold must be greater than zero.");
  }

  const { data, error } = await supabase
    .from("inventory_items")
    .update(updates)
    .eq("id", itemId)
    .eq("user_id", user.id)
    .select("id, user_id, name, category, stock, unit, threshold, created_at, updated_at")
    .single();

  if (error) throw error;
  return mapInventoryItem(data);
}

export async function deleteInventoryItem(userId, itemId) {
  const user = await getAuthenticatedUser(userId);
  const { error } = await supabase
    .from("inventory_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) throw error;
}
