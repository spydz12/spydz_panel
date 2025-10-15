import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

// init Admin SDK once
if (!admin.apps.length) {
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
  admin.initializeApp({ credential: admin.credential.cert(sa) });
}

const db = admin.firestore();

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const snap = await db.collection('pending_users').get();
    const users = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        email: (data.email || data.email1 || '').toString(),
        fullName: (data.fullName || data.fullname || '').toString(),
      };
    });
    return res.status(200).json({ users });
  } catch (err: any) {
    console.error('get-pending-users error:', err);
    return res.status(500).json({ message: err.message || 'server error' });
  }
}