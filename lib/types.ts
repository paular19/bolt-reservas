export type UnitType =
  | "refugio"
  | "camping"
  | "cabana"
  | "habitacion1"
  | "habitacion2";
import { Timestamp } from "firebase-admin/firestore";

export interface ReservationUnit {
  type: UnitType;
  name: string;
  capacity: number;
  isIndividual: boolean; // true for refugio/camping, false for cabana/habitaciones
}

export interface BookingData {
  unit: UnitType;
  persons: number;
  startDate: Date;
  endDate: Date;
  contactName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  includeBreakfast: boolean;
  includeLunch: boolean;
}

export interface Reservation {
  id: string;
  unit: UnitType;
  persons: number;
  startDate: Timestamp;
  endDate: Timestamp;
  contactName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  includeBreakfast: boolean;
  includeLunch: boolean;
  origin: "web" | "admin";
  status: "pending" | "confirmed" | "cancelled";
  paymentId?: string;
  reason?: string; // For admin bookings/blocks
  createdAt: Date;
  updatedAt: Date;
}

export interface AvailabilityDate {
  date: Date;
  available: boolean;
  remainingCapacity: number;
}
