import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import {
  createReservation,
  updateReservation,
} from "@/lib/firebase/reservation-server";
import { sendBookingConfirmation } from "@/lib/email";
import { BookingData } from "@/lib/types";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === "payment") {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: body.data.id });

      if (paymentData.status === "approved") {
        // Extract booking data from payment metadata
        const bookingData: BookingData = JSON.parse(
          paymentData.metadata?.booking_data || "{}"
        );

        // Create reservation in database
        const reservationId = await createReservation({
          ...bookingData,
          origin: "web",
          status: "confirmed",
          paymentId: paymentData.id?.toString(),
        });

        // Send confirmation emails
        await sendBookingConfirmation(bookingData, reservationId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}
