import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type PendingUser = { email: string; fullName: string };

export default function GenerateCodePage() {
  const [email, setEmail] = useState('');
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // charger les emails en attente
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/get-pending-users');
        const data = await res.json();
        setPendingUsers(data.users || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleGenerate = async () => {
    if (!email || !startDate || !endDate) {
      setMessage('❌ Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const code = uuidv4().slice(0, 8).toUpperCase();
      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, startDate, endDate, code }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Code généré avec succès : ${data.code}`);
        // إزالة الإيميل من القائمة بعد النقل
        setPendingUsers((old) => old.filter((u) => u.email !== email));
        setEmail('');
        setStartDate('');
        setEndDate('');
      } else {
        setMessage(`⚠️ Erreur : ${data.message}`);
      }
    } catch (e) {
      console.error(e);
      setMessage('⚠️ Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎯 Générer un code d’activation</h1>

      <label style={styles.label}>Sélectionner l’utilisateur :</label>
      <select
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      >
        <option value="">-- Sélectionnez un e-mail --</option>
        {pendingUsers.map((u) => (
          <option key={u.email} value={u.email}>
            {u.fullName} ({u.email})
          </option>
        ))}
      </select>

      <label style={styles.label}>Date de début :</label>
      <input
        type="datetime-local"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>Date de fin :</label>
      <input
        type="datetime-local"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleGenerate} style={styles.button} disabled={loading}>
        {loading ? '⏳ Génération en cours...' : '⚡ Générer le code'}
      </button>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: 'sans-serif',
    maxWidth: 420,
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
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    marginTop: 20,
    cursor: 'pointer',
  },
  message: { marginTop: 15, textAlign: 'center' },
};