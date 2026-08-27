import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
  limit,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
import { Report, Comment } from "@/lib/types";
import { getDemoReports } from "@/lib/demo/seed";

const REPORTS_COLLECTION = "reports";
const COMMENTS_COLLECTION = "comments";

export async function getReports(): Promise<Report[]> {
  if (!isFirebaseConfigured || !db) {
    return getDemoReports();
  }
  try {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(100)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Report));
  } catch {
    return getDemoReports();
  }
}

export async function getReport(id: string): Promise<Report | null> {
  if (!isFirebaseConfigured || !db) {
    const reports = getDemoReports();
    return reports.find((r) => r.id === id) ?? null;
  }
  try {
    const snap = await getDoc(doc(db, REPORTS_COLLECTION, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Report;
  } catch {
    return null;
  }
}

export async function createReport(
  data: Omit<Report, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    return `rep-${Date.now()}`;
  }
  const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return docRef.id;
}

export async function updateReport(
  id: string,
  data: Partial<Report>
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  await updateDoc(doc(db, REPORTS_COLLECTION, id), {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function getNearbyReports(
  lat: number,
  lng: number,
  radiusKm: number = 0.5
): Promise<Report[]> {
  const all = await getReports();
  return all.filter((r) => {
    const dlat = r.location.lat - lat;
    const dlng = r.location.lng - lng;
    const dist = Math.sqrt(dlat * dlat + dlng * dlng) * 111;
    return dist <= radiusKm;
  });
}

export function subscribeToReports(
  callback: (reports: Report[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    callback(getDemoReports());
    return () => {};
  }
  const q = query(
    collection(db, REPORTS_COLLECTION),
    orderBy("createdAt", "desc"),
    limit(100)
  );
  return onSnapshot(q, (snap) => {
    const reports = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Report));
    callback(reports);
  });
}

export async function getComments(reportId: string): Promise<Comment[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where("reportId", "==", reportId),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
}

export async function addComment(
  data: Omit<Comment, "id" | "createdAt">
): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    return `cmt-${Date.now()}`;
  }
  const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}
