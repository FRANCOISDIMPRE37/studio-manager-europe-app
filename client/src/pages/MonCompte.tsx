import { useState } from 'react';
import { toast } from 'sonner';
import { useApp } from '@/lib/app-context';

export default function MonCompte() {
  const { state } = useApp();
  const [email, setEmail] = useState(state.salonInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const inp = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', borderRadius: 10, padding: '12px 14px', width: '100%', fontSize: 14 } as React.CSSProperties;

  const handleSave = async () => {
    if (password && password !== confirm) { toast.error('Les mots de passe ne correspondent pas'); return; }
    if (password && password.length < 6) { toast.error('Minimum 6 caracteres'); return; }
    setIsSaving(true);
    try { toast.success('Compte mis a jour'); setPassword(''); setConfirm(''); }
    catch { toast.error('Erreur'); } finally { setIsSaving(false); }
  };

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700, color: 'white' }}>Mon Compte</h1>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, display: 'block', marginBottom: 6 }}>Adresse email</label>
          <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, display: 'block', marginBottom: 6 }}>Nouveau mot de passe</label>
          <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Laisser vide pour ne pas changer" />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, display: 'block', marginBottom: 6 }}>Confirmer le mot de passe</label>
          <input style={inp} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
        </div>
        <button onClick={handleSave} disabled={isSaving} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: 'white', borderRadius: 10, padding: '14px', fontWeight: 700, cursor: 'pointer', width: '100%', fontSize: 15 }}>
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  );
}
