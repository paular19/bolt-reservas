import { createReservationAction } from "../../../actions/reservations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { UNITS, RESERVATION_STATUS } from "@/lib/constants";

export default async function NewReservationPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            {/* <Button variant="outline" onClick={() => router.back()}>
              ← Volver
            </Button> */}
            <h1 className="text-3xl font-bold ml-4">Nueva Reserva</h1>
          </div>

          <form action={createReservationAction} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unidad *</Label>
                    <Select name="unit">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(UNITS).map((unit) => (
                          <SelectItem key={unit.type} value={unit.type}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Personas *</Label>
                    <Select name="persons" defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(
                          (num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha de Entrada *</Label>
                    <Input type="date" name="startDate" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha de Salida *</Label>
                    <Input type="date" name="endDate" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Motivo (Opcional)</Label>
                    <Textarea
                      name="reason"
                      placeholder="Motivo del bloqueo o reserva especial"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Origen</Label>
                    <Input name="origin" value={"manual"} />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select name="persons" defaultValue={RESERVATION_STATUS[1]}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RESERVATION_STATUS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datos de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input name="contactName" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Apellido *</Label>
                    <Input name="contactLastName" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" name="contactEmail" />
                  </div>

                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input name="contactPhone" />
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeBreakfast" name="includeBreakfast" />
                    <Label htmlFor="includeBreakfast">Incluir Desayuno</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeLunch" name="includeLunch" />
                    <Label htmlFor="includeLunch">Incluir Almuerzo</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifyUser"
                      name="notifyUser"
                      defaultChecked
                    />
                    <Label htmlFor="notifyUser">
                      Notificar al usuario por email
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex fle-row justify-end">
              <Button type="submit">Crear</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
