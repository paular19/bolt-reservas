//import { Resend } from 'resend';
import { BookingData } from './types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

//const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(
  bookingData: BookingData,
  reservationId: string
) {
  const startDateFormatted = format(bookingData.startDate, 'dd/MM/yyyy', { locale: es });
  const endDateFormatted = format(bookingData.endDate, 'dd/MM/yyyy', { locale: es });

  const customerEmailHtml = `
    <h1>Confirmación de Reserva - Refugio de Montaña</h1>
    <p>Estimado/a ${bookingData.contactName} ${bookingData.contactLastName},</p>
    <p>Su reserva ha sido confirmada exitosamente:</p>
    
    <h3>Detalles de la Reserva</h3>
    <ul>
      <li><strong>ID de Reserva:</strong> ${reservationId}</li>
      <li><strong>Unidad:</strong> ${bookingData.unit}</li>
      <li><strong>Personas:</strong> ${bookingData.persons}</li>
      <li><strong>Fecha de Entrada:</strong> ${startDateFormatted}</li>
      <li><strong>Fecha de Salida:</strong> ${endDateFormatted}</li>
      <li><strong>Desayuno:</strong> ${bookingData.includeBreakfast ? 'Sí' : 'No'}</li>
      <li><strong>Almuerzo:</strong> ${bookingData.includeLunch ? 'Sí' : 'No'}</li>
    </ul>

    <p>Esperamos verlo pronto en nuestro refugio.</p>
    <p>Saludos cordiales,<br>Equipo Refugio de Montaña</p>
  `;

  const adminEmailHtml = `
    <h1>Nueva Reserva Recibida</h1>
    <p>Se ha recibido una nueva reserva:</p>
    
    <h3>Detalles</h3>
    <ul>
      <li><strong>ID:</strong> ${reservationId}</li>
      <li><strong>Cliente:</strong> ${bookingData.contactName} ${bookingData.contactLastName}</li>
      <li><strong>Email:</strong> ${bookingData.contactEmail}</li>
      <li><strong>Teléfono:</strong> ${bookingData.contactPhone}</li>
      <li><strong>Unidad:</strong> ${bookingData.unit}</li>
      <li><strong>Personas:</strong> ${bookingData.persons}</li>
      <li><strong>Fechas:</strong> ${startDateFormatted} - ${endDateFormatted}</li>
      <li><strong>Extras:</strong> ${[
        bookingData.includeBreakfast && 'Desayuno',
        bookingData.includeLunch && 'Almuerzo'
      ].filter(Boolean).join(', ') || 'Ninguno'}</li>
    </ul>
  `;

  // await Promise.all([
  //   // Email to customer
  //   resend.emails.send({
  //     from: 'noreply@refugio.com',
  //     to: [bookingData.contactEmail],
  //     subject: 'Confirmación de Reserva - Refugio de Montaña',
  //     html: customerEmailHtml,
  //   }),
  //   // Email to admin
  //   resend.emails.send({
  //     from: 'noreply@refugio.com',
  //     to: [process.env.ADMIN_EMAIL!],
  //     subject: `Nueva Reserva - ${bookingData.contactName} ${bookingData.contactLastName}`,
  //     html: adminEmailHtml,
  //   }),
  // ]);
}