import { MercadoPagoConfig, Preference } from 'mercadopago';
import { BookingData } from './types';
import { PRICES, UNITS } from './constants';
import { differenceInDays } from 'date-fns';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function createPaymentPreference(bookingData: BookingData): Promise<string> {
  const preference = new Preference(client);

  const nights = differenceInDays(bookingData.endDate, bookingData.startDate);
  const unit = UNITS[bookingData.unit];
  
  // Calculate base price
  let basePrice: number;
  if (unit.isIndividual) {
    basePrice = PRICES[bookingData.unit] * bookingData.persons * nights;
  } else {
    basePrice = PRICES[bookingData.unit] * nights;
  }

  // Calculate extras
  const breakfastPrice = bookingData.includeBreakfast 
    ? PRICES.breakfast * bookingData.persons * (nights + 1) 
    : 0;
  const lunchPrice = bookingData.includeLunch 
    ? PRICES.lunch * bookingData.persons * (nights + 1) 
    : 0;

  const totalPrice = basePrice + breakfastPrice + lunchPrice;

  const preferenceData = {
    items: [
      {
        title: `Reserva ${unit.name} - ${nights} noches`,
        quantity: 1,
        unit_price: totalPrice,
        currency_id: 'ARS',
      },
    ],
    payer: {
      name: bookingData.contactName,
      surname: bookingData.contactLastName,
      email: bookingData.contactEmail,
      phone: {
        number: bookingData.contactPhone,
      },
    },
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success`,
      failure: `${process.env.NEXT_PUBLIC_APP_URL}/booking/failure`,
      pending: `${process.env.NEXT_PUBLIC_APP_URL}/booking/pending`,
    },
    auto_return: 'approved',
    notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    metadata: {
      booking_data: JSON.stringify(bookingData),
    },
  };

  const response = await preference.create({ body: preferenceData });
  return response.id!;
}