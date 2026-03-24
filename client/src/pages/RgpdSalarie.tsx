import { useState } from 'react';
import { useLocation } from 'wouter';
import { useApp } from '@/lib/app-context';
import { Shield, ChevronLeft, FileText } from 'lucide-react';

export default function RgpdSalarie() {
  const [, navigate] = useLocation();
  const { state } = useApp();
  const [selectedClientId, setSelectedClientId] = useState('');

  const clients = state.clients || [];

  const handleOpen = () => {
    if (!selectedClientId) return;
    navigate(`/clients/${selectedClientId}/document/engagement_confidentialite`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm mb-6"
        style={{ color: 'var(--brand-cyan)' }}
      >
        <ChevronLeft size={16} />
        Retour
      </button>

      <div className="flex items-center gap-3 mb-2">
        <Shield size={28} style={{ color: 'var(--brand-cyan)' }} />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-cyan)' }}>
          Engagement de Confidentialité
        </h1>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--brand-text-muted)' }}>
        Doc 11 — RGPD Art. 29 · À faire signer par chaque salarié
      </p>

      <div
        className="rounded-xl p-6"
        style={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText size={18} style={{ color: 'var(--brand-cyan)' }} />
          <span className="font-semibold" style={{ color: 'var(--brand-text)' }}>
            Sélectionner un salarié
          </span>
        </div>

        <select
          value={selectedClientId}
          onChange={e => setSelectedClientId(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm mb-4"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--brand-border)',
            color: 'var(--brand-text)',
          }}
        >
          <option value="">-- Choisir un salarié --</option>
          {clients.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.prenom} {c.nom}
            </option>
          ))}
        </select>

        <button
          onClick={handleOpen}
          disabled={!selectedClientId}
          className="w-full py-3 rounded-lg font-semibold text-sm transition-opacity"
          style={{
            background: selectedClientId ? 'var(--brand-cyan)' : 'rgba(255,255,255,0.1)',
            color: selectedClientId ? 'var(--brand-navy)' : 'var(--brand-text-muted)',
            cursor: selectedClientId ? 'pointer' : 'not-allowed',
          }}
        >
          Ouvrir le formulaire
        </button>
      </div>

      <div
        className="mt-6 rounded-xl p-4 text-xs"
        style={{
          background: 'rgba(0,188,212,0.07)',
          border: '1px solid rgba(0,188,212,0.2)',
          color: 'var(--brand-text-muted)',
        }}
      >
        <strong style={{ color: 'var(--brand-cyan)' }}>Base légale :</strong> Art. 29 RGPD — Le sous-traitant et toute personne agissant sous son autorité traitent les données uniquement sur instruction du responsable de traitement. Conservation : durée du contrat + 5 ans.
      </div>
    </div>
  );
}
