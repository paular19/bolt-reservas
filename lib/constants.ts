import { ReservationUnit } from "./types";

export const UNITS: Record<string, ReservationUnit> = {
  refugio: {
    type: "refugio",
    name: "Refugio (35 camas)",
    capacity: 35,
    isIndividual: true,
  },
  camping: {
    type: "camping",
    name: "Camping (50 plazas)",
    capacity: 50,
    isIndividual: true,
  },
  cabana: {
    type: "cabana",
    name: "Cabaña completa (8 camas)",
    capacity: 8,
    isIndividual: false,
  },
  habitacion1: {
    type: "habitacion1",
    name: "Habitación 1 (4 camas)",
    capacity: 4,
    isIndividual: false,
  },
  habitacion2: {
    type: "habitacion2",
    name: "Habitación 2 (4 camas)",
    capacity: 4,
    isIndividual: false,
  },
};

export const PRICES = {
  refugio: 5000, // per person per night
  camping: 3000, // per person per night
  cabana: 40000, // total per night
  habitacion1: 20000, // total per night
  habitacion2: 20000, // total per night
  breakfast: 2000, // per person per day
  lunch: 3000, // per person per day
};

export const RESERVATION_STATUS = ["pendiente", "confirmada", "cancelada"];
