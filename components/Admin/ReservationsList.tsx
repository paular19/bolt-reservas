'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Reservation } from '@/lib/types';
import { UNITS } from '@/lib/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReservationsListProps {
  initialReservations: Reservation[];
  includeHistory: boolean;
  currentPage: number;
  limit: number;
}

export default function ReservationsList({ 
  initialReservations, 
  includeHistory, 
  currentPage, 
  limit 
}: ReservationsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reservations] = useState(initialReservations);

  const updateSearchParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/admin?${params.toString()}`);
  };

  const handleHistoryToggle = (checked: boolean) => {
    updateSearchParams({ history: checked ? 'true' : '', page: '1' });
  };

  const handleLimitChange = (newLimit: string) => {
    updateSearchParams({ limit: newLimit, page: '1' });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'default',
      pending: 'secondary',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] as any}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Create New Reservation */}
      <div className="flex justify-end">
        <Button onClick={() => router.push('/admin/reservations/new')}>
          Nueva Reserva
        </Button>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {reservations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No hay reservas que mostrar</p>
            </CardContent>
          </Card>
        ) : (
          reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardContent className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div>
                    <p className="font-medium">{reservation.contactName} {reservation.contactLastName}</p>
                    <p className="text-sm text-muted-foreground">{reservation.contactEmail}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">{UNITS[reservation.unit]?.name}</p>
                    <p className="text-sm text-muted-foreground">{reservation.persons} personas</p>
                  </div>
                  
                  <div>
                    <p className="text-sm">
                      {format(reservation.startDate, 'dd/MM/yyyy', { locale: es })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(reservation.endDate, 'dd/MM/yyyy', { locale: es })}
                    </p>
                  </div>
                  
                  <div>
                    {getStatusBadge(reservation.status)}
                  </div>
                  
                  <div>
                    <Badge variant="outline">
                      {reservation.origin}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/admin/reservations/${reservation.id}`)}
                    >
                      Ver
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/admin/reservations/${reservation.id}/edit`)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {reservations.length === limit && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => updateSearchParams({ page: (currentPage + 1).toString() })}
          >
            Cargar más
          </Button>
        </div>
      )}
    </div>
  );
}