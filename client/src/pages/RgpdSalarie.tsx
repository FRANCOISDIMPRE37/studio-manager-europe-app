/*
 * DESIGN: Studio Nocturne — Page RGPD & Confidentialité — Salarié(s)
 * Document 11 — Engagement de Confidentialité Salarié (RGPD Art. 29)
 */
import { useState } from 'react';
import { Shield, FileText, Eye, User, ChevronRight, Search, X, Lock } from 'lucide-react';
import { DOCUMENT_LABELS, DocumentType } from '@/lib/types';
import { useApp } from '@/lib/app-context';
import { useLocation } from 'wouter';

const SALARIE_DOCS: DocumentType[] = ['engagement_confidentialite'];

export default function RgpdSalarie() {
  const { state } = useApp();
  const [, navigate] = useLocation();
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [clientSearch, setClientSearch] = useState('');

  const activeClients = state.clients.filter(c => !c.estArchive);

  const filteredClients = activeClients.filter(c => {
    const q = clientSearch.toLowerCase();
    return (
      c.nom.toLowerCase().includes(q) ||
      c.prenom.toLowerCase().includes(q) ||
      (c.telephone && c.telephone.includes(q))
    );
  });

  const handlePreview = (doc: DocumentType) => {
    setSelectedDoc(doc);
    setClientSearch('');
  };

  const handleSelectClient = (clientId: string) => {
    if (!selectedDoc) return;
    navigate(`/clients/${clientId}/document/${selectedDoc}`);
    setSelectedDoc(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-700" style={{ color: 'var(--brand-text)', fontFamily: 'Outfit', fontWeight: 700 }}>
          RGPD & Confidentialité — Salarié(s)
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--brand-text-muted)' }}>
          Engagement de confidentialité et protection des données personnelles
        </p>
      </div>

      {/* Info RGPD Art. 29 */}
      <div className="p-4 rounded-xl" style={{ background: 'rgba(229, 57, 53, 0.05)', border: '1px solid rgba(229, 57, 53, 0.2)' }}>
        <div className="flex items-start gap-3">
          <Lock size={18} style={{ color: '#E53935', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-sm font-600" style={{ color: '#E53935', fontWeight: 600 }}>
              Obligation légale — RGPD Art. 29 & Art. 32
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--brand-text-muted)' }}>
              Toute personne traitant des données personnelles sous l'autorité du responsable de traitement
              doit s'engager à respecter la confidentialité des données. Cet engagement est obligatoire
              pour tous les salariés et prestataires du salon.
            </p>
          </div>
        </div>
      </div>

      {/* Obligations du salarié */}
      <div className="studio-card p-4">
        <h2 className="text-sm font-600 mb-3" style={{ color: 'var(--brand-text)', fontWeight: 600 }}>
          Obligations du salarié (Art. 29 RGPD)
        </h2>
        <div className="space-y-2">
          {[
            { num: '1', text: 'Traiter les données uniquement selon les instructions du responsable' },
            { num: '2', text: 'Ne pas divulguer les données à des tiers non autorisés' },
            { num: '3', text: 'Respecter les mesures de sécurité mises en place' },
            { num: '4', text: 'Signaler toute violation de données dès qu\'elle est constatée' },
            { num: '5', text: 'Respecter les droits des personnes concernées (accès, rectification, effacement)' },
          ].map(({ num, text }) => (
            <div key={num} className="flex items-start gap-2.5 p-2 rounded-lg" style={{ background: 'rgba(131,208,245,0.05)', border: '1px solid rgba(131,208,245,0.1)' }}>
              <span className="text-xs font-700 mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-cyan)', fontWeight: 700, fontFamily: 'Outfit' }}>{num}.</span>
              <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Document */}
      <div className="studio-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(229, 57, 53, 0.15)' }}>
            <Shield size={16} style={{ color: '#E53935' }} />
          </div>
          <h2 className="text-sm font-600" style={{ color: 'var(--brand-text)', fontWeight: 600 }}>
            Document Salarié (11)
          </h2>
          <span className="text-xs px-1.5 py-0.5 rounded ml-auto" style={{ background: 'rgba(229, 57, 53, 0.15)', color: '#E53935' }}>
            {SALARIE_DOCS.length} fiche
          </span>
        </div>
        <div className="space-y-2">
          {SALARIE_DOCS.map(doc => (
            <div
              key={doc}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-border)' }}
            >
              <FileText size={14} style={{ color: 'var(--brand-text-muted)', flexShrink: 0 }} />
              <span className="flex-1 text-sm" style={{ color: 'var(--brand-text)' }}>{DOCUMENT_LABELS[doc]}</span>
              <button
                onClick={() => handlePreview(doc)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all hover:opacity-80"
                style={{
                  background: 'rgba(229, 57, 53, 0.1)',
                  color: '#E53935',
                  fontWeight: 600,
                  border: '1px solid rgba(229, 57, 53, 0.2)',
                }}
                title="Ouvrir pour un salarié"
              >
                <Eye size={12} />
                Ouvrir
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mentions légales */}
      <div className="studio-card p-4 text-xs space-y-2" style={{ color: 'var(--brand-text-muted)' }}>
        <p style={{ fontWeight: 600, color: 'var(--brand-text)' }}>Base légale</p>
        <p>RGPD Art. 29 — Traitement sous l'autorité du responsable du traitement ou du sous-traitant.</p>
        <p>RGPD Art. 32 — Sécurité du traitement : obligation de confidentialité.</p>
        <p>L'écrit électronique a la même force probante que l'écrit papier (Art. 1366 du Code civil).</p>
        <p>Contact DPO : <span style={{ color: 'var(--brand-cyan)' }}>francois-dimpre@intemporelle.eu</span></p>
      </div>

      <div className="text-center py-4">
        <p className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
          Documents fournis par <span style={{ color: 'var(--brand-cyan)' }}>Intemporelle</span> — RGPD & Cybersécurité · Tours (37)
        </p>
      </div>

      {/* Modal sélecteur de salarié/client */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedDoc(null); }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-5 space-y-4"
            style={{ background: 'var(--brand-card)', border: '1px solid var(--brand-border)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-700 text-base" style={{ color: 'var(--brand-text)', fontWeight: 700, fontFamily: 'Outfit' }}>
                  Choisir un salarié / client
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--brand-text-muted)' }}>
                  {DOCUMENT_LABELS[selectedDoc]}
                </p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition-all"
                style={{ color: 'var(--brand-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--brand-text-muted)' }} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--brand-border)',
                  color: 'var(--brand-text)',
                }}
              />
            </div>

            <div className="overflow-y-auto flex-1 space-y-1.5" style={{ minHeight: 0 }}>
              {filteredClients.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--brand-text-muted)' }}>
                  <User size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aucun résultat</p>
                  <button
                    onClick={() => navigate('/clients')}
                    className="mt-3 text-xs underline"
                    style={{ color: 'var(--brand-cyan)' }}
                  >
                    Créer un nouveau client
                  </button>
                </div>
              ) : (
                filteredClients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectClient(client.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-white/10"
                    style={{ border: '1px solid var(--brand-border)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-700 flex-shrink-0"
                      style={{
                        background: 'rgba(131, 208, 245, 0.15)',
                        color: 'var(--brand-cyan)',
                        fontWeight: 700,
                        fontFamily: 'Outfit',
                      }}
                    >
                      {client.prenom[0]}{client.nom[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-600 truncate" style={{ color: 'var(--brand-text)', fontWeight: 600 }}>
                        {client.prenom} {client.nom}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--brand-text-muted)' }}>
                        {client.telephone || 'Aucun contact'}
                      </p>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--brand-text-muted)', flexShrink: 0 }} />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
