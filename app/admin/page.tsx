import { redirect } from 'next/navigation';
import { getReservations } from '@/lib/firebase/reservations';
import ReservationsList from '@/components/Admin/ReservationsList';

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

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const isAuthorized = await checkAdminAuth();
  
  if (!isAuthorized) {
    redirect('/admin/login');
  }

  const includeHistory = searchParams.history === 'true';
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '20');

  const { reservations, lastDoc } = await getReservations({
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

          <ReservationsList 
            initialReservations={reservations}
            includeHistory={includeHistory}
            currentPage={page}
            limit={limit}
          />
        </div>
      </div>
    </div>
  );
}