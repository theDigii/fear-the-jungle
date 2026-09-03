"use server";

import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import {
  addGalleryImage,
  moveGalleryImage,
  removeGalleryImage,
  updateGalleryCaption,
} from "@/lib/content";

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export async function uploadImageAction(formData: FormData): Promise<void> {
  await requireAdmin();
  if (!process.env.BLOB_READ_WRITE_TOKEN) redirect("/backend/gallery?error=blob");

  const file = formData.get("file");
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 300);
  if (!(file instanceof File) || file.size === 0) redirect("/backend/gallery?error=nofile");
  if (!TYPES.has(file.type)) redirect("/backend/gallery?error=type");
  if (file.size > MAX_BYTES) redirect("/backend/gallery?error=size");

  // The stored name is ours, never the upload's: a safe stem plus the real
  // extension, under a gallery/ prefix, with Blob's random suffix so two
  // uploads of "screenshot.png" cannot collide or overwrite.
  const ext = file.type === "image/jpeg" ? "jpg" : file.type.slice("image/".length);
  const stem = (file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "image").slice(0, 60);
  const blob = await put(`gallery/${stem}.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  await addGalleryImage(blob.url, caption);
  revalidatePath("/");
  redirect("/backend/gallery?saved=1");
}

export async function captionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 300);
  if (Number.isInteger(id) && id > 0) await updateGalleryCaption(id, caption);
  revalidatePath("/");
  redirect("/backend/gallery?saved=1");
}

export async function moveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (Number.isInteger(id) && id > 0) await moveGalleryImage(id, direction);
  revalidatePath("/");
  redirect("/backend/gallery");
}

export async function removeAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id) && id > 0) {
    const url = await removeGalleryImage(id);
    // The row goes first so the page never shows a dead image; the blob
    // going second means a failed delete leaves an orphan file, not a broken
    // tile. Orphans are visible in the Vercel Blob browser.
    if (url && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(url);
      } catch (err) {
        console.error("Blob delete failed for", url, err);
      }
    }
  }
  revalidatePath("/");
  redirect("/backend/gallery?removed=1");
}
