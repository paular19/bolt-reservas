import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Reservation } from "@/lib/types";
import { UNITS } from "@/lib/constants";
import { es } from "date-fns/locale";
import Link from "next/link";
import LoadMore from "./LoadMore";
import { format } from "date-fns";

interface ReservationsProps {
  reservations: Reservation[];
}

export default function Reservations({ reservations }: ReservationsProps) {
  // given a status of a reservation return a Badge component with the color variant for that status
  const getStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive";

    switch (status) {
      case "confirmed":
        variant = "default";
        break;
      case "pending":
        variant = "secondary";
        break;
      case "cancelled":
        variant = "destructive";
        break;
      default:
        variant = "secondary";
    }
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {reservations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay reservas que mostrar
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contacto</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Personas</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <p className="font-medium">
                      {reservation.contactName} {reservation.contactLastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.contactEmail}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      {UNITS[reservation.unit]?.name}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">
                      {reservation.persons} personas
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {format(reservation.startDate.toDate(), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(reservation.endDate.toDate(), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </p>
                  </TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{reservation.origin}</Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Link
                      href={`/admin/reservations/${reservation.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/admin/reservations/${reservation.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <LoadMore listLength={reservations.length} />
    </div>
  );
}
