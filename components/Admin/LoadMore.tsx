"use client";
import { useFilter } from "@/hooks/use-searchParams";
import { Button } from "../ui/button";

export default function LoadMore({ listLength }: { listLength: number }) {
  const { updateSearchParams, limit, page } = useFilter();
  if (listLength !== limit) return;
  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        onClick={() => updateSearchParams({ page: (page + 1).toString() })}
      >
        Cargar más
      </Button>
    </div>
  );
}
