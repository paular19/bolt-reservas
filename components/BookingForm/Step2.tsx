'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function Step2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    contactName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    includeBreakfast: false,
    includeLunch: false,
  });

  // Initialize from URL params
  useEffect(() => {
    const name = searchParams.get('contactName');
    const lastName = searchParams.get('contactLastName');
    const email = searchParams.get('contactEmail');
    const phone = searchParams.get('contactPhone');
    const breakfast = searchParams.get('includeBreakfast') === 'true';
    const lunch = searchParams.get('includeLunch') === 'true';

    setFormData({
      contactName: name || '',
      contactLastName: lastName || '',
      contactEmail: email || '',
      contactPhone: phone || '',
      includeBreakfast: breakfast,
      includeLunch: lunch,
    });
  }, [searchParams]);

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', '1');
    router.push(`/booking?${params.toString()}`);
  };

  const handleContinue = () => {
    if (!formData.contactName || !formData.contactLastName || !formData.contactEmail || !formData.contactPhone) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    Object.entries(formData).forEach(([key, value]) => {
      params.set(key, value.toString());
    });
    params.set('step', '3');
    
    router.push(`/booking?${params.toString()}`);
  };

  const canContinue = formData.contactName && formData.contactLastName && 
                     formData.contactEmail && formData.contactPhone;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Nombre *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder="Ingrese su nombre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactLastName">Apellido *</Label>
              <Input
                id="contactLastName"
                value={formData.contactLastName}
                onChange={(e) => setFormData({ ...formData, contactLastName: e.target.value })}
                placeholder="Ingrese su apellido"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Teléfono *</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              placeholder="+54 11 1234-5678"
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Servicios Adicionales</h4>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeBreakfast"
                checked={formData.includeBreakfast}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, includeBreakfast: checked as boolean })
                }
              />
              <Label htmlFor="includeBreakfast">
                Incluir Desayuno ($2.000 por persona por día)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeLunch"
                checked={formData.includeLunch}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, includeLunch: checked as boolean })
                }
              />
              <Label htmlFor="includeLunch">
                Incluir Almuerzo ($3.000 por persona por día)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Volver
        </Button>
        <Button onClick={handleContinue} disabled={!canContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}