import { Suspense } from 'react';
import StepIndicator from '@/components/BookingForm/StepIndicator';
import Step1 from '@/components/BookingForm/Step1';
import Step2 from '@/components/BookingForm/Step2';
import Step3 from '@/components/BookingForm/Step3';
import { getAvailabilityForUnit } from '@/lib/availability';
import { UnitType } from '@/lib/types';

interface BookingPageProps {
  searchParams: { 
    step?: string;
    unit?: UnitType;
    startDate?: string;
    endDate?: string;
  };
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const step = parseInt(searchParams.step || '1');
  const currentStep = Math.max(1, Math.min(3, step));

  // Get availability data for Step 1
  let availabilityDates: Date[] = [];
  if (searchParams.unit && searchParams.startDate && searchParams.endDate) {
    const startDate = new Date(searchParams.startDate);
    const endDate = new Date(searchParams.endDate);
    
    try {
      const availability = await getAvailabilityForUnit(searchParams.unit, startDate, endDate);
      availabilityDates = availability
        .filter(day => day.available)
        .map(day => day.date);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 availabilityDates={availabilityDates} />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      default:
        return <Step1 availabilityDates={availabilityDates} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Reserva tu Estadía
          </h1>
          
          <Suspense fallback={<div>Cargando...</div>}>
            <StepIndicator currentStep={currentStep} totalSteps={3} />
            {renderStep()}
          </Suspense>
        </div>
      </div>
    </div>
  );
}