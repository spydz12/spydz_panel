// pages/generate-code.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  addDoc, collection, serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import dayjs from 'dayjs';

export default function GenerateCodePage() {
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!email || !startDate || !endDate) {
      setStatus('⛔ يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    const code = uuidv4().slice(0, 8); // كود قصير

    try {
      await addDoc(collection(db, 'activation_codes'), {
        email,
        code,
        createdAt: serverTimestamp(),
        startsAt: new Date(startDate),
        expiresAt: new Date(endDate),
      });
      setStatus(`✅ الكود تم إنشاؤه: ${code}`);
    } catch (error) {
      console.error(error);
      setStatus('❌ خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>🎯 توليد كود التفعيل</h2>
      <input type="email" placeholder="البريد الإلكتروني"
        value={email} onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }} />
      <input type="date" value={startDate}
        onChange={e => setStartDate(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }} />
      <input type="date" value={endDate}
        onChange={e => setEndDate(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }} />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'جارٍ التوليد...' : '🔐 توليد الكود'}
      </button>
      <p style={{ marginTop: 10 }}>{status}</p>
    </div>
  );
}