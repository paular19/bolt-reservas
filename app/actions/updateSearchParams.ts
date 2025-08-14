"use server";

import { redirect } from "next/navigation";

// this function updates a query param, sets in the url and redirects the route to it.
// for example, ?limit=10
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
