"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { TEXT_DEFAULTS, saveText, type TextKey } from "@/lib/content";

export async function saveTextAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const values: Partial<Record<TextKey, string>> = {};
  for (const key of Object.keys(TEXT_DEFAULTS) as TextKey[]) {
    const raw = formData.get(key);
    if (typeof raw === "string") values[key] = raw.slice(0, 4000);
  }
  if (values.discord_url && !/^https:\/\/(discord\.gg|discord\.com)\//.test(values.discord_url.trim())) {
    redirect("/backend/text?error=discord");
  }
  await saveText(values);
  revalidatePath("/");
  redirect("/backend/text?saved=1");
}
