import { useRouter, useSearchParams } from "next/navigation";

export const useFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateSearchParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.replace(`/admin?${params.toString()}`);
  };

  const includeHistory = searchParams?.get("history") === "true" || false;
  const page = parseInt(searchParams?.get("page") || "1");
  const limit = parseInt(searchParams?.get("limit") || "20");

  return {
    includeHistory,
    page,
    limit,
    updateSearchParams,
  };
};
