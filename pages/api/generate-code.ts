// pages/api/generate-code.ts
import * as admin from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

// ✅ نهيئ Firebase Admin مرة واحدة فقط
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();
const Timestamp = admin.firestore.Timestamp;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, startDate, endDate } = req.body;

  if (!email || !startDate || !endDate) {
    return res.status(400).json({ success: false, message: '⛔ يرجى ملء جميع الحقول' });
  }

  const code = uuidv4().slice(0, 8);

  try {
    await db.collection('activation_codes').add({
      email: email.trim().toLowerCase(),
      code,
      createdAt: Timestamp.now(),
      startsAt: new Date(startDate),
      expiresAt: new Date(endDate),
    });

    return res.status(200).json({ success: true, code });
  } catch (error) {
    console.error('🔥 Firebase Admin Error:', error);
    return res.status(500).json({ success: false, message: '❌ خطأ أثناء إنشاء الكود' });
  }
}