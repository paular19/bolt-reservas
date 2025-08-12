import admin from 'firebase-admin';
import { Reservation } from '../types';

// Inicialización (solo hacerlo 1 vez en tu app)
if (!admin.apps.length) {
  admin.initializeApp({
    // credenciales o configuración necesaria
  });
}

const db = admin.firestore();
const COLLECTION_NAME = 'reservations';

export async function createReservation(
  reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = admin.firestore.Timestamp.now();
  const reservationData = {
    ...reservation,
    createdAt: now,
    updatedAt: now,
    startDate: admin.firestore.Timestamp.fromDate(reservation.startDate),
    endDate: admin.firestore.Timestamp.fromDate(reservation.endDate),
  };

  const docRef = await db.collection(COLLECTION_NAME).add(reservationData);
  return docRef.id;
}

export async function updateReservation(id: string, data: Partial<Reservation>): Promise<void> {
  const docRef = db.collection(COLLECTION_NAME).doc(id);
  const updateData: any = {
    ...data,
    updatedAt: admin.firestore.Timestamp.now(),
  };

  if (data.startDate) updateData.startDate = admin.firestore.Timestamp.fromDate(data.startDate);
  if (data.endDate) updateData.endDate = admin.firestore.Timestamp.fromDate(data.endDate);

  await docRef.update(updateData);
}

export async function deleteReservation(id: string): Promise<void> {
  const docRef = db.collection(COLLECTION_NAME).doc(id);
  await docRef.delete();
}

export async function getReservations(options: {
  includeHistory?: boolean;
  pageSize?: number;
  lastDocId?: string; // Aquí recibimos el id del último doc para paginar
}): Promise<{ reservations: Reservation[]; lastDocId?: string }> {
  const { includeHistory = false, pageSize = 20, lastDocId } = options;

  let queryRef: FirebaseFirestore.Query = db.collection(COLLECTION_NAME).orderBy('startDate', 'desc');

  if (!includeHistory) {
    const today = admin.firestore.Timestamp.now();
    queryRef = queryRef.where('endDate', '>=', today);
  }

  if (lastDocId) {
    // Obtener documento del lastDocId para startAfter
    const lastDocSnap = await db.collection(COLLECTION_NAME).doc(lastDocId).get();
    if (lastDocSnap.exists) {
      queryRef = queryRef.startAfter(lastDocSnap);
    }
  }

  if (pageSize) {
    queryRef = queryRef.limit(pageSize);
  }

  const snapshot = await queryRef.get();

  const reservations = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Reservation;
  });

  const lastDocIdResult = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : undefined;

  return { reservations, lastDocId: lastDocIdResult };
}

export async function getReservationsInDateRange(
  startDate: Date,
  endDate: Date
): Promise<Reservation[]> {
  const startTimestamp = admin.firestore.Timestamp.fromDate(startDate);
  const endTimestamp = admin.firestore.Timestamp.fromDate(endDate);

  // Firestore limita múltiples inequalities en la misma consulta, cuidado con filtros complejos
  // Aquí un workaround sin filtro status != 'cancelled' porque admin.firestore no soporta '!=' directamente

  const snapshot = await db.collection(COLLECTION_NAME)
    .where('startDate', '<=', endTimestamp)
    .where('endDate', '>=', startTimestamp)
    .get();

  // Filtrar cancelados en el backend (ya que no podemos hacer '!=' directo)
  const filtered = snapshot.docs.filter(doc => doc.data().status !== 'cancelled');

  return filtered.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Reservation;
  });
}
