'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { addDays, isBefore } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UnitType } from '@/lib/types';
import { UNITS } from '@/lib/constants';
import 'react-day-picker/dist/style.css';

interface Step1Props {
  availabilityDates?: Date[];
}

export default function Step1({ availabilityDates = [] }: Step1Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedUnit, setSelectedUnit] = useState<UnitType | ''>('');
  const [persons, setPersons] = useState(1);
  const [selectedDates, setSelectedDates] = useState<{ from?: Date; to?: Date }>({});

  // Initialize from URL params
  useEffect(() => {
    const unit = searchParams.get('unit') as UnitType;
    const personsParam = searchParams.get('persons');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (unit && UNITS[unit]) setSelectedUnit(unit);
    if (personsParam) setPersons(parseInt(personsParam));
    if (startDate && endDate) {
      setSelectedDates({
        from: new Date(startDate),
        to: new Date(endDate),
      });
    }
  }, [searchParams]);

  const handleContinue = () => {
    if (!selectedUnit || !selectedDates.from || !selectedDates.to) return;

    const params = new URLSearchParams({
      unit: selectedUnit,
      persons: persons.toString(),
      startDate: selectedDates.from.toISOString(),
      endDate: selectedDates.to.toISOString(),
      step: '2',
    });

    router.push(`/booking?${params.toString()}`);
  };

  const disabledDays = [
    { before: new Date() },
    ...availabilityDates.map(date => ({ 
      before: addDays(date, 1),
      after: addDays(date, -1)
    }))
  ];

  const canContinue = selectedUnit && selectedDates.from && selectedDates.to && persons > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seleccione Unidad y Fechas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Unit Selection */}
          <div className="space-y-2">
            <Label>Unidad de Alojamiento</Label>
            <Select value={selectedUnit} onValueChange={(value) => setSelectedUnit(value as UnitType)}>
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

          {/* Persons */}
          <div className="space-y-2">
            <Label>Número de Personas</Label>
            <Select value={persons.toString()} onValueChange={(value) => setPersons(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: selectedUnit ? UNITS[selectedUnit]?.capacity || 10 : 10 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendar */}
          {selectedUnit && (
            <div className="space-y-2">
              <Label>Fechas de Estadía</Label>
              <DayPicker
                mode="range"
                selected={selectedDates}
                onSelect={setSelectedDates}
                disabled={disabledDays}
                locale={es}
                className="border rounded-md p-3"
                classNames={{
                  day_selected: "bg-primary text-primary-foreground",
                  day_range_middle: "bg-primary/50 text-primary-foreground",
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={!canContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}