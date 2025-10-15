import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function GenerateCodePage() {
  const [email, setEmail] = useState('');
  const [pendingUsers, setPendingUsers] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 🟢 جلب المستخدمين من pending_users عند تحميل الصفحة
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch('/api/get-pending-users');
        if (res.ok) {
          const data = await res.json();
          setPendingUsers(data.users || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPending();
  }, []);

  // 🟢 عند توليد الكود
  const handleGenerate = async () => {
    if (!email || !startDate || !endDate) {
      setMessage('❌ الرجاء ملء جميع الحقول');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const code = uuidv4().slice(0, 8).toUpperCase(); // كود مختصر جميل
      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, startDate, endDate, code }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ تم إنشاء الكود بنجاح: ${data.code}`);
      } else {
        setMessage(`⚠️ خطأ: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ حدث خطأ غير متوقع');
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎯 توليد كود تفعيل</h1>

      <label style={styles.label}>اختر المستخدم:</label>
      <select
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      >
        <option value="">-- اختر البريد --</option>
        {pendingUsers.map((u) => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>

      <label style={styles.label}>تاريخ البداية:</label>
      <input
        type="datetime-local"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>تاريخ النهاية:</label>
      <input
        type="datetime-local"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        style={styles.input}
      />

      <button
        onClick={handleGenerate}
        style={styles.button}
        disabled={loading}
      >
        {loading ? '⏳ جاري التوليد...' : '⚡ توليد الكود'}
      </button>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles: any = {
  container: {
    fontFamily: 'sans-serif',
    maxWidth: 400,
    margin: '60px auto',
    background: '#f4f4f4',
    borderRadius: 10,
    padding: 30,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: { textAlign: 'center', color: '#2e7d32' },
  label: { display: 'block', marginTop: 15, fontWeight: 'bold' },
  input: {
    width: '100%',
    padding: 8,
    borderRadius: 5,
    border: '1px solid #ccc',
    marginTop: 5,
  },
  button: {
    width: '100%',
    padding: 10,
    background: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    marginTop: 20,
    cursor: 'pointer',
  },
  message: { marginTop: 15, textAlign: 'center' },
};