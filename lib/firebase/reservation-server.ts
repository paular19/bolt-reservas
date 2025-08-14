import { Reservation } from "../types";

import { db, auth, default as admin } from "./config";

const COLLECTION_NAME = "reservations";

export async function createReservation(
  reservation: Omit<Reservation, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const now = admin.firestore.Timestamp.now();

  // TODO:
  // fix  this hack. This is because we expect a date but sometimes is a timestamp string, from client.
  // const startDate =
  //   reservation.startDate instanceof Date
  //     ? reservation.startDate
  //     : new Date(reservation.startDate);

  // const endDate =
  //   reservation.endDate instanceof Date
  //     ? reservation.endDate
  //     : new Date(reservation.endDate);

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

export async function updateReservation(
  id: string,
  data: Partial<Reservation>
): Promise<void> {
  const docRef = db.collection(COLLECTION_NAME).doc(id);
  const updateData: any = {
    ...data,
    updatedAt: admin.firestore.Timestamp.now(),
  };

  if (data.startDate)
    updateData.startDate = admin.firestore.Timestamp.fromDate(data.startDate);
  if (data.endDate)
    updateData.endDate = admin.firestore.Timestamp.fromDate(data.endDate);

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
  let queryRef: FirebaseFirestore.Query = admin
    .firestore()
    .collection(COLLECTION_NAME);

  if (!includeHistory) {
    const today = admin.firestore.Timestamp.now();
    queryRef = queryRef.where("endDate", ">=", today);
  }
  queryRef = queryRef.orderBy("endDate", "desc");

  if (lastDocId) {
    // Obtener documento del lastDocId para startAfter
    const lastDocSnap = await admin
      .firestore()
      .collection(COLLECTION_NAME)
      .doc(lastDocId)
      .get();
    if (lastDocSnap.exists) {
      queryRef = queryRef.startAfter(lastDocSnap);
    }
  }

  if (pageSize) {
    queryRef = queryRef.limit(pageSize);
  }

  const snapshot = await queryRef.get();

  const reservations = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startDate: data.startDate,
      endDate: data.endDate,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as Reservation;
  });

  const lastDocIdResult =
    snapshot.docs.length > 0
      ? snapshot.docs[snapshot.docs.length - 1].id
      : undefined;

  return { reservations, lastDocId: lastDocIdResult };
}

export async function getReservationsInDateRange(
  startDate: Date,
  endDate: Date
): Promise<Reservation[]> {
  const startTimestamp =
    startDate instanceof Date ? startDate : new Date(startDate);
  const endTimestamp = endDate instanceof Date ? endDate : new Date(endDate);

  // Firestore limita múltiples inequalities en la misma consulta, cuidado con filtros complejos
  // Aquí un workaround sin filtro status != 'cancelled' porque admin.firestore no soporta '!=' directamente

  const snapshot = await db
    .collection(COLLECTION_NAME)
    .where("startDate", "<=", endTimestamp)
    .where("endDate", ">=", startTimestamp)
    .get();

  // Filtrar cancelados en el backend (ya que no podemos hacer '!=' directo)
  const filtered = snapshot.docs.filter(
    (doc) => doc.data().status !== "cancelled"
  );

  return filtered.map((doc) => {
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
