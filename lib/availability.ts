import { UnitType, AvailabilityDate } from "./types";
import { UNITS } from "./constants";
import { getReservationsInDateRange } from "./firebase/reservation-server";
import { eachDayOfInterval, isSameDay } from "date-fns";

export async function getAvailabilityForUnit(
  unit: UnitType,
  startDate: Date,
  endDate: Date
): Promise<AvailabilityDate[]> {
  const reservations = await getReservationsInDateRange(startDate, endDate);
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  const availabilityDates: AvailabilityDate[] = dates.map((date) => {
    const conflictingReservations = reservations.filter((reservation) => {
      return (
        date >= reservation.startDate &&
        date <= reservation.endDate &&
        isUnitConflict(unit, reservation.unit)
      );
    });

    const occupiedCapacity = calculateOccupiedCapacity(
      unit,
      conflictingReservations,
      date
    );
    const totalCapacity = UNITS[unit].capacity;
    const remainingCapacity = totalCapacity - occupiedCapacity;

    return {
      date,
      available: remainingCapacity > 0,
      remainingCapacity: Math.max(0, remainingCapacity),
    };
  });

  return availabilityDates;
}

function isUnitConflict(unit1: UnitType, unit2: UnitType): boolean {
  // Same unit always conflicts
  if (unit1 === unit2) return true;

  // Cabaña conflicts with both habitaciones
  if (
    unit1 === "cabana" &&
    (unit2 === "habitacion1" || unit2 === "habitacion2")
  )
    return true;
  if (
    unit2 === "cabana" &&
    (unit1 === "habitacion1" || unit1 === "habitacion2")
  )
    return true;

  // Habitaciones conflict with cabaña (already covered above)
  return false;
}

function calculateOccupiedCapacity(
  unit: UnitType,
  conflictingReservations: any[],
  date: Date
): number {
  if (!UNITS[unit].isIndividual) {
    // For cabana/habitaciones, if there's any reservation, it's fully occupied
    return conflictingReservations.length > 0 ? UNITS[unit].capacity : 0;
  }

  // For refugio/camping, sum up the persons
  return conflictingReservations.reduce((sum, reservation) => {
    return sum + reservation.persons;
  }, 0);
}

export async function checkAvailability(
  unit: UnitType,
  persons: number,
  startDate: Date,
  endDate: Date
): Promise<boolean> {
  console.log(startDate);
  console.log(endDate);
  const availability = await getAvailabilityForUnit(unit, startDate, endDate);

  // Check if all dates in the range are available
  return availability.every((dateAvailability) => {
    if (!UNITS[unit].isIndividual) {
      // For cabana/habitaciones, just check availability
      return dateAvailability.available;
    }

    // For refugio/camping, check if there's enough capacity
    return dateAvailability.remainingCapacity >= persons;
  });
}
