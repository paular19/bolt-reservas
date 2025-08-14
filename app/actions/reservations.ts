"use server";

import { Reservation } from "@/lib/types";
import { db, default as admin } from "@/lib/firebase/config";

const COLLECTION_NAME = "reservations";

// Create
import { redirect } from "next/navigation";

export async function createReservationAction(
  reservation: FormData
): Promise<void> {
  console.log(reservation);
  const now = admin.firestore.Timestamp.now();

  // convert dates from FormData, from DatePicker, into dates and then Firestore.Timestamps
  const startDateTime = reservation.get("startDate") + "T00:00:00Z";
  const endDateTime = reservation.get("endDate") + "T00:00:00Z";

  if (!startDateTime || !endDateTime) {
    throw new Error("Start date and end date are required.");
  }

  // Preparing the object to insert in the collection.
  // Dates should be firestore.Timestamp so then we ca read easily
  const reservationData = {
    createdAt: now,
    updatedAt: now,
    startDate: admin.firestore.Timestamp.fromDate(
      new Date(startDateTime as string)
    ),
    endDate: admin.firestore.Timestamp.fromDate(
      new Date(endDateTime as string)
    ),
    contactName: reservation.get("contactName"),
    contactLastName: reservation.get("contactLastName"),
    contactEmail: reservation.get("contactEmail"),
    contactPhone: reservation.get("contactPhone"),
    unit: reservation.get("unit"),
    persons: reservation.get("persons"),
    reason: reservation.get("reason"),
    includeBreakfast: reservation.get("includeBreakfast"),
    includeLunch: reservation.get("includeLunch"),
    notifyUser: reservation.get("notifyUser"),
    // Add othe r fields from FormData as needed
  };

  await db.collection(COLLECTION_NAME).add(reservationData);
  redirect("/admin");
}

// Update
export async function updateReservationAction(
  id: string,
  data: Partial<Reservation>
): Promise<void> {
  const docRef = db.collection(COLLECTION_NAME).doc(id);
  const updateData: any = {
    ...data,
    updatedAt: admin.firestore.Timestamp.now(),
  };

  if (data.startDate)
    updateData.startDate = admin.firestore.Timestamp.fromDate(
      data.startDate.toDate()
    );
  if (data.endDate)
    updateData.endDate = admin.firestore.Timestamp.fromDate(
      data.endDate.toDate()
    );

  await docRef.update(updateData);
}

// Delete
export async function deleteReservationAction(id: string): Promise<void> {
  await db.collection(COLLECTION_NAME).doc(id).delete();
}

// Get paginated
export async function getReservationsAction(options: {
  includeHistory?: boolean;
  pageSize?: number;
  lastDocId?: string;
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
    const lastDocSnap = await admin
      .firestore()
      .collection(COLLECTION_NAME)
      .doc(lastDocId)
      .get();
    if (lastDocSnap.exists) queryRef = queryRef.startAfter(lastDocSnap);
  }

  if (pageSize) queryRef = queryRef.limit(pageSize);

  const snapshot = await queryRef.get();
  const reservations = snapshot.docs.map((doc) => {
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

  const lastDocIdResult =
    snapshot.docs.length > 0
      ? snapshot.docs[snapshot.docs.length - 1].id
      : undefined;

  return { reservations, lastDocId: lastDocIdResult };
}

// Get by date range
export async function getReservationsInDateRangeAction(
  startDate: Date,
  endDate: Date
): Promise<Reservation[]> {
  const startTimestamp =
    startDate instanceof Date ? startDate : new Date(startDate);
  const endTimestamp = endDate instanceof Date ? endDate : new Date(endDate);

  const snapshot = await db
    .collection(COLLECTION_NAME)
    .where("startDate", "<=", endTimestamp)
    .where("endDate", ">=", startTimestamp)
    .get();

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
