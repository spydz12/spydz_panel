import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

// 🟢 Initialiser Firebase Admin une seule fois
if (!admin.apps.length) {
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
  admin.initializeApp({ credential: admin.credential.cert(sa) });
}

const db = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { email, startDate, endDate, code } = req.body as {
      email?: string;
      startDate?: string;
      endDate?: string;
      code?: string;
    };

    if (!email || !startDate || !endDate || !code) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1️⃣ Ajouter le code dans activation_codes
    await db.collection('activation_codes').add({
      email: normalizedEmail,
      code,
      createdAt: admin.firestore.Timestamp.now(),
      startDate: new Date(startDate),
      expiresAt: new Date(endDate),
    });

    // 2️⃣ Chercher l’utilisateur dans pending_users (insensible à la casse)
    const pendingSnap = await db.collection('pending_users').get();
    const pendingDoc = pendingSnap.docs.find(
      (doc) =>
        (doc.data().email || '').toLowerCase().trim() === normalizedEmail
    );

    if (!pendingDoc) {
      return res
        .status(404)
        .json({ message: 'Utilisateur introuvable dans pending_users' });
    }

    const userData = pendingDoc.data();

    // 3️⃣ Copier les infos vers activate_users
    await db.collection('activate_users').add({
      ...userData,
      email: normalizedEmail,
      code,
      activatedAt: admin.firestore.Timestamp.now(),
      startDate: new Date(startDate),
      expiresAt: new Date(endDate),
    });

    // 4️⃣ Supprimer de pending_users
    await db.collection('pending_users').doc(pendingDoc.id).delete();

    // 5️⃣ Ajouter un log d’administration
    await db.collection('admin_logs').add({
      type: 'activation',
      email: normalizedEmail,
      code,
      message: `Code généré et compte activé avec succès pour ${normalizedEmail}`,
      createdAt: admin.firestore.Timestamp.now(),
    });

    return res.status(200).json({
      message: '✅ Code généré et utilisateur activé avec succès',
      code,
    });
  } catch (err: any) {
    console.error('generate-code error:', err);
    return res
      .status(500)
      .json({ message: err.message || 'Erreur serveur' });
  }
}