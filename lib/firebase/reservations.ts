import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  limit, 
  startAfter,
  Timestamp,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import { Reservation, UnitType } from '../types';
import { nanoid } from 'nanoid';

const COLLECTION_NAME = 'reservations';

export async function createReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const reservationData = {
    ...reservation,
    id: nanoid(),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    startDate: Timestamp.fromDate(reservation.startDate),
    endDate: Timestamp.fromDate(reservation.endDate),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), reservationData);
  return reservationData.id;
}

export async function updateReservation(id: string, data: Partial<Reservation>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const updateData = {
    ...data,
    updatedAt: Timestamp.fromDate(new Date()),
    ...(data.startDate && { startDate: Timestamp.fromDate(data.startDate) }),
    ...(data.endDate && { endDate: Timestamp.fromDate(data.endDate) }),
  };
  
  await updateDoc(docRef, updateData);
}

export async function deleteReservation(id: string): Promise<void> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('id', '==', id)
  );
  
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    await deleteDoc(snapshot.docs[0].ref);
  }
}

export async function getReservations(options: {
  includeHistory?: boolean;
  pageSize?: number;
  lastDoc?: DocumentSnapshot;
}): Promise<{ reservations: Reservation[]; lastDoc?: DocumentSnapshot }> {
  const { includeHistory = false, pageSize = 20, lastDoc } = options;
  
  let q = query(
    collection(db, COLLECTION_NAME),
    orderBy('startDate', 'desc')
  );

  if (!includeHistory) {
    const today = Timestamp.fromDate(new Date());
    q = query(q, where('endDate', '>=', today));
  }

  if (pageSize) {
    q = query(q, limit(pageSize));
  }

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const reservations = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Reservation;
  });

  return {
    reservations,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
  };
}

export async function getReservationsInDateRange(
  startDate: Date,
  endDate: Date
): Promise<Reservation[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('startDate', '<=', Timestamp.fromDate(endDate)),
    where('endDate', '>=', Timestamp.fromDate(startDate)),
    where('status', '!=', 'cancelled')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Reservation;
  });
}