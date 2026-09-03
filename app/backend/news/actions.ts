"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createPost, deletePost, updatePost } from "@/lib/content";

function readPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim().slice(0, 200);
  const body = String(formData.get("body") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 20000);
  const published = formData.get("published") === "on";
  return { title, body, published };
}

export async function createPostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const { title, body, published } = readPost(formData);
  if (!title) redirect("/backend/news?error=title");
  const id = await createPost(title, body, published);
  revalidatePath("/");
  redirect(`/backend/news/${id}?saved=1`);
}

export async function updatePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/backend/news");
  const { title, body, published } = readPost(formData);
  if (!title) redirect(`/backend/news/${id}?error=title`);
  await updatePost(id, title, body, published);
  revalidatePath("/");
  redirect(`/backend/news/${id}?saved=1`);
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id) && id > 0) await deletePost(id);
  revalidatePath("/");
  redirect("/backend/news?deleted=1");
}
