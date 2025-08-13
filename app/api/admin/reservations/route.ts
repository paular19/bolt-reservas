import { NextRequest, NextResponse } from "next/server";
import { createReservation } from "@/lib/firebase/reservation-server";
import { sendBookingConfirmation } from "@/lib/email";
import { checkAvailability } from "@/lib/availability";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log(data);
    // Check availability
    // const isAvailable = await checkAvailability(
    //   data.unit,
    //   data.persons,
    //   data.startDate,
    //   data.endDate
    // );
    const isAvailable = true;

    if (!isAvailable) {
      return NextResponse.json(
        { error: "Las fechas seleccionadas no están disponibles" },
        { status: 400 }
      );
    }

    // Create reservation
    const reservationId = await createReservation({
      ...data,
      origin: "admin",
      status: "confirmed",
    });

    // Send email notification if requested
    // if (data.notifyUser && data.contactEmail) {
    //   await sendBookingConfirmation(data, reservationId);
    // }

    return NextResponse.json({ id: reservationId });
  } catch (error) {
    console.error("Error creating admin reservation:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
