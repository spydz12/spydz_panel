import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

// 🔹 initialize Firebase Admin SDK once
if (!admin.apps.length) {
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
  admin.initializeApp({ credential: admin.credential.cert(sa) });
}

const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 🟢 fetch all pending users
    const snap = await db.collection('pending_users').get();

    if (snap.empty) {
      return res.status(200).json({ users: [] });
    }

    // 🧩 extract email + fullName
    const users = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        email: (data.email || '').toString(),
        fullName: (data.fullName || '').toString(),
      };
    });

    return res.status(200).json({ users });
  } catch (err: any) {
    console.error('get-pending-users error:', err);
    return res.status(500).json({ message: err.message || 'Erreur serveur' });
  }
}