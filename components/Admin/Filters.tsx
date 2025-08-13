"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";

import Link from "next/link";
import { useFilter } from "@/hooks/use-searchParams";

export default function Filters({ searchParams }: any): any {
  // this should be the pattern in SSR but we have also a hook for client.
  const { limit, includeHistory, page, updateSearchParams } = useFilter();

  const handleHistoryToggle = (checked: boolean) => {
    updateSearchParams({ history: checked ? "true" : "", page: "1" });
  };

  const handleLimitChange = (newLimit: string) => {
    updateSearchParams({ limit: newLimit, page: "1" });
  };

  return (
    <div className="flex flex-row space-between items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="history"
            checked={includeHistory}
            onCheckedChange={handleHistoryToggle}
          />
          <label htmlFor="history">Incluir historial</label>
        </div>

        <div className="flex items-center space-x-2">
          <span>Reservas por página:</span>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end btn">
        <Link href={"/admin/reservations/new"}>
          <Button>Nueva Reserva</Button>
        </Link>
      </div>
    </div>
  );
}
