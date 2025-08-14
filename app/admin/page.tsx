import { redirect } from "next/navigation";
import { getReservations } from "@/lib/firebase/reservation-server";
import Reservations from "@/components/Admin/Reservations";
import Filters from "@/components/Admin/Filters";

interface AdminPageProps {
  searchParams: {
    history?: string;
    page?: string;
    limit?: string;
  };
}

// This would be replaced with actual auth check
async function checkAdminAuth() {
  // TODO: Implement Firebase Auth check for admin user
  return true;
}
export const dynamic = "force-dynamic";
export default async function AdminPage({ searchParams }: AdminPageProps) {
  const isAuthorized = await checkAdminAuth();

  if (!isAuthorized) {
    redirect("/admin/login");
  }

  // TODO: move this into getReservations
  // this should be the pattern in SSR but we have also a hook for client.
  const includeHistory = (await searchParams)?.history === "true" || false;
  const limit = parseInt((await searchParams)?.limit || "20");

  console.log("en admin", includeHistory, limit);
  const { reservations, lastDocId } = await getReservations({
    includeHistory,
    pageSize: limit,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
          </div>
          <Filters searchParams={searchParams} />
          <Reservations reservations={reservations} />
        </div>
      </div>
    </div>
  );
}
