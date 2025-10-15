import React, { useState } from 'react';

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
    setStatus('⏳ جاري إنشاء الكود...');

    try {
      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, startDate, endDate }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus(`✅ الكود تم إنشاؤه: ${data.code}`);
      } else {
        setStatus(`❌ ${data.message || 'حدث خطأ أثناء إنشاء الكود'}`);
      }
    } catch (error) {
      console.error(error);
      setStatus('⚠️ خطأ في الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: 'sans-serif',
        maxWidth: 400,
        margin: '50px auto',
        border: '1px solid #ddd',
        borderRadius: 10,
        backgroundColor: '#fafafa',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#2e7d32' }}>🎯 توليد كود التفعيل</h2>

      <label>البريد الإلكتروني:</label>
      <input
        type="email"
        placeholder="example@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
          border: '1px solid #ccc',
        }}
      />

      <label>تاريخ البداية:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
          border: '1px solid #ccc',
        }}
      />

      <label>تاريخ النهاية:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: 10,
          marginBottom: 20,
          borderRadius: 6,
          border: '1px solid #ccc',
        }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          width: '100%',
          backgroundColor: '#2e7d32',
          color: '#fff',
          padding: 12,
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 16,
        }}
      >
        {loading ? 'جارٍ التوليد...' : '🔐 توليد الكود'}
      </button>

      <p style={{ marginTop: 20, textAlign: 'center', color: '#333' }}>{status}</p>
    </div>
  );
}