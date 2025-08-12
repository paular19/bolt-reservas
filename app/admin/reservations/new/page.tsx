'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { UNITS } from '@/lib/constants';
import { UnitType } from '@/lib/types';

export default function NewReservationPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    unit: '' as UnitType | '',
    persons: 1,
    startDate: '',
    endDate: '',
    contactName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    includeBreakfast: false,
    includeLunch: false,
    reason: '',
    notifyUser: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
        }),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        alert('Error al crear la reserva');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la reserva');
    }
  };

  const canSubmit = formData.unit && formData.startDate && formData.endDate && 
                   formData.contactName && formData.contactLastName;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="outline" onClick={() => router.back()}>
              ← Volver
            </Button>
            <h1 className="text-3xl font-bold ml-4">Nueva Reserva</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unidad *</Label>
                    <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value as UnitType })}>
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
                    <Select 
                      value={formData.persons.toString()} 
                      onValueChange={(value) => setFormData({ ...formData, persons: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha de Entrada *</Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha de Salida *</Label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Motivo (Opcional)</Label>
                  <Textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Motivo del bloqueo o reserva especial"
                  />
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
                    <Input
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Apellido *</Label>
                    <Input
                      value={formData.contactLastName}
                      onChange={(e) => setFormData({ ...formData, contactLastName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeBreakfast"
                      checked={formData.includeBreakfast}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, includeBreakfast: checked as boolean })
                      }
                    />
                    <Label htmlFor="includeBreakfast">Incluir Desayuno</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeLunch"
                      checked={formData.includeLunch}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, includeLunch: checked as boolean })
                      }
                    />
                    <Label htmlFor="includeLunch">Incluir Almuerzo</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifyUser"
                      checked={formData.notifyUser}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, notifyUser: checked as boolean })
                      }
                    />
                    <Label htmlFor="notifyUser">Notificar al usuario por email</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={!canSubmit}>
                Crear Reserva
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}