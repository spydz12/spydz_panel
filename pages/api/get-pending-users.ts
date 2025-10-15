import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

// ✅ Initialize Firebase Admin safely (once)
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
  }
}

const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 🟢 Fetch all users from pending_users
    const snap = await db.collection('pending_users').get();

    if (snap.empty) {
      return res.status(200).json({ users: [] });
    }

    // 🧩 Extract fields
    const users = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: (data.email || '').toString(),
        fullName: (data.fullName || '').toString(),
      };
    });

    return res.status(200).json({ users });
  } catch (err: any) {
    console.error('🔥 Error fetching pending users:', err);
    return res.status(500).json({
      message: err.message || 'Erreur serveur',
    });
  }
}