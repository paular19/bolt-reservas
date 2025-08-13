// app/actions/updateSearchParams.ts
"use server";

import { redirect } from "next/navigation";

export async function updateSearchParamsAction(
  currentParams: string,
  updates: Record<string, string>,
  basePath: string
) {
  const params = new URLSearchParams(currentParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (value) params.set(key, value);
    else params.delete(key);
  });

  redirect(`${basePath}?${params.toString()}`);
}
