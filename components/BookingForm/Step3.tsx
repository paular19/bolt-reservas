'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UNITS, PRICES } from '@/lib/constants';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Step3() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const unit = searchParams.get('unit');
  const persons = parseInt(searchParams.get('persons') || '1');
  const startDate = new Date(searchParams.get('startDate') || '');
  const endDate = new Date(searchParams.get('endDate') || '');
  const contactName = searchParams.get('contactName') || '';
  const contactLastName = searchParams.get('contactLastName') || '';
  const contactEmail = searchParams.get('contactEmail') || '';
  const contactPhone = searchParams.get('contactPhone') || '';
  const includeBreakfast = searchParams.get('includeBreakfast') === 'true';
  const includeLunch = searchParams.get('includeLunch') === 'true';

  if (!unit || !UNITS[unit]) {
    return <div>Error: Datos incompletos</div>;
  }

  const nights = differenceInDays(endDate, startDate);
  const unitInfo = UNITS[unit];
  
  // Calculate prices
  const basePrice = unitInfo.isIndividual 
    ? PRICES[unit] * persons * nights
    : PRICES[unit] * nights;
    
  const breakfastPrice = includeBreakfast ? PRICES.breakfast * persons * (nights + 1) : 0;
  const lunchPrice = includeLunch ? PRICES.lunch * persons * (nights + 1) : 0;
  const totalPrice = basePrice + breakfastPrice + lunchPrice;

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', '2');
    router.push(`/booking?${params.toString()}`);
  };

  const handlePayment = async () => {
    // Create payment and redirect to Mercado Pago
    const bookingData = {
      unit,
      persons,
      startDate,
      endDate,
      contactName,
      contactLastName,
      contactEmail,
      contactPhone,
      includeBreakfast,
      includeLunch,
    };

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const { preferenceId } = await response.json();
      
      // Redirect to Mercado Pago
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Error al procesar el pago. Inténtelo de nuevo.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de la Reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Guest Information */}
          <div>
            <h4 className="font-medium mb-2">Información del Huésped</h4>
            <p>{contactName} {contactLastName}</p>
            <p>{contactEmail}</p>
            <p>{contactPhone}</p>
          </div>

          {/* Booking Details */}
          <div>
            <h4 className="font-medium mb-2">Detalles de la Reserva</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Unidad:</span>
                <p className="font-medium">{unitInfo.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Personas:</span>
                <p className="font-medium">{persons}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Entrada:</span>
                <p className="font-medium">{format(startDate, 'dd/MM/yyyy', { locale: es })}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Salida:</span>
                <p className="font-medium">{format(endDate, 'dd/MM/yyyy', { locale: es })}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Noches:</span>
                <p className="font-medium">{nights}</p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div>
            <h4 className="font-medium mb-2">Detalle de Precios</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{unitInfo.name} x {nights} noches {unitInfo.isIndividual ? `x ${persons} personas` : ''}</span>
                <span>${basePrice.toLocaleString()}</span>
              </div>
              {includeBreakfast && (
                <div className="flex justify-between text-sm">
                  <span>Desayuno x {persons} personas x {nights + 1} días</span>
                  <span>${breakfastPrice.toLocaleString()}</span>
                </div>
              )}
              {includeLunch && (
                <div className="flex justify-between text-sm">
                  <span>Almuerzo x {persons} personas x {nights + 1} días</span>
                  <span>${lunchPrice.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Volver
        </Button>
        <Button onClick={handlePayment} size="lg" className="px-8">
          Pagar Reserva
        </Button>
      </div>
    </div>
  );
}