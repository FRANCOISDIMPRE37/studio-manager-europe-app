import { useState, type CSSProperties } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { FileText, KeyRound, Pencil, Printer, Trash2, UserPlus, X } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { ClientDocument } from '@/lib/types';

const SPECIALITES = [
  "— Choisir —", "Tatouage", "Piercing", "Dermographie"
];

const TYPES_CONTRAT = [
  '— Choisir —', 'CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Intérim'
];

type DirigeantRole = 'employe' | 'admin' | 'stagiaire';

type DirigeantForm = {
  prenom: string;
  nom: string;
  role: DirigeantRole;
  specialite: string;
  typeContrat: string;
  dateEntree: string;
  dateSortie: string;
  adresse: string;
  pin: string;
};

const EMPTY_FORM: DirigeantForm = {
  prenom: '',
  nom: '',
  role: 'admin',
  specialite: '',
  typeContrat: '',
  dateEntree: '',
  dateSortie: '',
  adresse: '',
  pin: '',
};

const REQUIRED_FIELDS: Array<{ key: keyof DirigeantForm; label: string }> = [
  { key: 'prenom', label: 'Prénom' },
  { key: 'nom', label: 'Nom' },
  { key: 'adresse', label: 'Adresse' },
];

export default function Dirigeant() {
  const [, navigate] = useLocation();
  const { state } = useApp();
  const [showForm, setShowForm] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DirigeantForm>(EMPTY_FORM);
  const [pinModal, setPinModal] = useState<{ id: number; nom: string; pin: string; confirmPin: string } | null>(null);
  const utils = trpc.useUtils();

  const list = trpc.studioUsers.list.useQuery();

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const del = trpc.studioUsers.delete.useMutation({
    onSuccess: () => {
      utils.studioUsers.list.invalidate();
      toast.success('Dirigeant supprimé');
    }
  });

  const create = trpc.studioUsers.create.useMutation({
    onSuccess: () => {
      utils.studioUsers.list.invalidate();
      setShowForm(false);
      resetForm();
      toast.success('Dirigeant créé !');
    },
    onError: (e) => toast.error(e.message)
  });

  const update = trpc.studioUsers.update.useMutation({
    onSuccess: () => {
      utils.studioUsers.list.invalidate();
      setShowForm(false);
      resetForm();
      toast.success('Fiche dirigeant mise à jour !');
    },
    onError: (e) => toast.error(e.message)
  });

  const savePin = trpc.studioUsers.update.useMutation({
    onSuccess: () => {
      utils.studioUsers.list.invalidate();
      setPinModal(null);
      toast.success('Code PIN tablette enregistré');
    },
    onError: (e) => toast.error(e.message)
  });

  const validateRequiredFields = () => {
    const missing = REQUIRED_FIELDS.filter(({ key }) => {
      return !String(form[key] ?? '').trim();
    });

    if (missing.length > 0) {
      toast.error(`Champs obligatoires : ${missing.map(f => f.label).join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateRequiredFields()) return;

    const cleanForm = {
      ...form,
      prenom: form.prenom.trim(),
      nom: form.nom.trim(),
      specialite: form.specialite.trim(),
      typeContrat: form.typeContrat.trim(),
      dateEntree: form.dateEntree.trim(),
      dateSortie: form.dateSortie.trim(),
      adresse: form.adresse.trim(),
      pin: form.pin.trim(),
    };

    if (cleanForm.pin && !/^\d{4}$/.test(cleanForm.pin)) {
      toast.error('Le code PIN tablette doit contenir exactement 4 chiffres.');
      return;
    }

    const { pin, ...basePayload } = cleanForm;
    const payload = pin ? { ...basePayload, pin } : basePayload;

    if (editingId) {
      update.mutate({
        id: editingId,
        ...payload,
      });
      return;
    }

    const login = (cleanForm.prenom + cleanForm.nom).toLowerCase().replace(/[^a-z0-9]/g, '') + Date.now();
    const password = Math.random().toString(36).slice(2, 10);
    create.mutate({ ...payload, login, password });
  };

  const startEdit = (dirigeant: any) => {
    setForm({
      prenom: dirigeant.prenom || '',
      nom: dirigeant.nom || '',
      role: (dirigeant.role || 'employe') as DirigeantRole,
      specialite: dirigeant.specialite || '',
      typeContrat: dirigeant.typeContrat || '',
      dateEntree: dirigeant.dateEntree || '',
      dateSortie: dirigeant.dateSortie || '',
      adresse: dirigeant.adresse || '',
      pin: '',
    });
    setEditingId(Number(dirigeant.id));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPinModal = (dirigeant: any) => {
    setPinModal({
      id: Number(dirigeant.id),
      nom: `${dirigeant.prenom || ''} ${dirigeant.nom || ''}`.trim(),
      pin: '',
      confirmPin: '',
    });
  };

  const handleSavePin = () => {
    if (!pinModal) return;
    if (!/^\d{4}$/.test(pinModal.pin)) {
      toast.error('Le code PIN tablette doit contenir exactement 4 chiffres.');
      return;
    }
    if (pinModal.pin !== pinModal.confirmPin) {
      toast.error('La confirmation du PIN ne correspond pas.');
      return;
    }
    savePin.mutate({ id: pinModal.id, pin: pinModal.pin });
  };

  const hasSignedEngagement = (salarieId: string): boolean => {
    const dirigeantAsClient = state.clients.find(c => c.id === `salarie-${salarieId}` || c.id === salarieId);
    return dirigeantAsClient?.documents?.some(
      (doc: ClientDocument) => doc.type === 'engagement_confidentialite' && doc.status === 'signed'
    ) ?? false;
  };

  const inp = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'white',
    borderRadius: 10,
    padding: '12px 14px',
    width: '100%',
    fontSize: 14,
    boxSizing: 'border-box' as const,
  } as CSSProperties;

  const optionStyle = {
    background: '#ffffff',
    color: '#111827',
  } as CSSProperties;

  const requiredLabel = (label: string) => `${label} *`;
  const isSaving = create.isPending || update.isPending;
  const isSavingPin = savePin.isPending;

  return (
    <div style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'white' }}>Dirigeants</h1>
        <button
          onClick={() => {
            if (showForm && editingId) resetForm();
            setShowForm(!showForm);
          }}
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', color: 'white', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <UserPlus size={16} />
          {showForm ? 'Masquer' : '+ Ajouter un dirigeant'}
        </button>
      </div>

      <div style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 16, padding: 18, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <FileText size={20} style={{ color: '#818cf8', flexShrink: 0, marginTop: 2 }} />
          <div>
            <h2 style={{ margin: 0, color: 'white', fontSize: 16, fontWeight: 700 }}>Fiche 15 — Engagement de Confidentialité (RGPD Art. 29)</h2>
            <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.62)', fontSize: 12, lineHeight: 1.5 }}>
              Cette fiche est réservée aux dirigeants. Elle n’apparaît plus dans les documents clients et doit être signée depuis la fiche du dirigeant concerné.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire dirigeant obligatoire et prérempli en modification */}
      {showForm && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, padding: 24, marginBottom: 24, maxHeight: '80vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: 0, color: 'white', fontSize: 17, fontWeight: 700 }}>{editingId ? 'Modifier la fiche dirigeant' : 'Nouveau dirigeant'}</h3>
              <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                Tous les champs marqués * sont obligatoires.
              </p>
            </div>
            {editingId && (
              <button
                onClick={resetForm}
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <X size={14} /> Annuler
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Prénom */}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, display: 'block', marginBottom: 6 }}>{requiredLabel('Prénom')}</label>
              <input required style={inp} value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} />
            </div>

            {/* Nom */}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, display: 'block', marginBottom: 6 }}>{requiredLabel('Nom')}</label>
              <input required style={inp} value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
            </div>






            {/* Adresse */}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, display: 'block', marginBottom: 6 }}>{requiredLabel('Adresse')}</label>
              <input required style={inp} value={form.adresse} onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} placeholder="Ex: 3 rue de Tours, 37000 Tours" />
            </div>


            <button
              onClick={handleSubmit}
              disabled={isSaving}
              style={{ width: '100%', background: '#22c55e', border: 'none', color: 'white', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: isSaving ? 0.7 : 1, marginTop: 8 }}
            >
              {isSaving ? 'Enregistrement...' : (editingId ? 'Enregistrer les modifications' : 'Créer le dirigeant')}
            </button>
          </div>
        </div>
      )}



      {pinModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.62)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
          <div style={{ width: '100%', maxWidth: 420, background: '#0A1628', border: '1px solid rgba(201,168,76,0.55)', borderRadius: 18, padding: 22, boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
              <div>
                <h3 style={{ margin: 0, color: 'white', fontSize: 18, fontWeight: 800 }}>Code PIN tablette</h3>
                <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.58)', fontSize: 12 }}>Créer ou modifier le PIN de {pinModal.nom}. Le code doit contenir exactement 4 chiffres.</p>
              </div>
              <button onClick={() => setPinModal(null)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', borderRadius: 8, padding: 8, cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, display: 'block', marginBottom: 6 }}>Nouveau PIN *</label>
                <input
                  style={inp}
                  value={pinModal.pin}
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  autoComplete="off"
                  onChange={e => setPinModal(m => m ? { ...m, pin: e.target.value.replace(/\D/g, '').slice(0, 4) } : m)}
                  placeholder="4 chiffres"
                />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, display: 'block', marginBottom: 6 }}>Confirmer le PIN *</label>
                <input
                  style={inp}
                  value={pinModal.confirmPin}
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  autoComplete="off"
                  onChange={e => setPinModal(m => m ? { ...m, confirmPin: e.target.value.replace(/\D/g, '').slice(0, 4) } : m)}
                  placeholder="Retaper les 4 chiffres"
                />
              </div>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.42)', fontSize: 11, lineHeight: 1.45 }}>Le PIN n’est jamais affiché après enregistrement. Il est stocké sous forme sécurisée et sert à ouvrir la tablette sur le parcours client.</p>
              <button
                onClick={handleSavePin}
                disabled={isSavingPin}
                style={{ width: '100%', background: '#C9A84C', border: 'none', color: '#111827', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 800, cursor: 'pointer', opacity: isSavingPin ? 0.7 : 1 }}
              >
                {isSavingPin ? 'Enregistrement...' : 'Enregistrer le code PIN'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des dirigeants */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {list.data?.filter((s: any) => s.role === "admin").map((dirigeant: any) => (
          <div key={dirigeant.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h4 style={{ margin: 0, color: 'white', fontSize: 16, fontWeight: 700 }}>{dirigeant.prenom} {dirigeant.nom}</h4>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                  {dirigeant.specialite} • {dirigeant.role}
                </p>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                  {dirigeant.typeContrat} • Entrée : {dirigeant.dateEntree || 'non renseignée'}
                  {dirigeant.dateSortie ? ` • Sortie : ${dirigeant.dateSortie}` : ''}
                </p>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                  Adresse : {dirigeant.adresse || 'non renseignée'}
                </p>
                <p style={{ margin: '4px 0 0', color: dirigeant.hasPinSet ? '#22c55e' : 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                  PIN tablette : {dirigeant.hasPinSet ? 'configuré' : 'non configuré'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => startEdit(dirigeant)}
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                >
                  <Pencil size={14} /> Modifier
                </button>
                <button
                  onClick={() => {
                    navigate(`/rgpd-salarie?salarieId=${dirigeant.id}`);
                  }}
                  style={{ background: hasSignedEngagement(dirigeant.id) ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.15)', border: `1px solid ${hasSignedEngagement(dirigeant.id) ? '#22c55e' : '#6366f1'}`, color: hasSignedEngagement(dirigeant.id) ? '#22c55e' : '#6366f1', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                >
                  <FileText size={14} /> {hasSignedEngagement(dirigeant.id) ? 'Signer' : 'Signer fiche 15'}
                </button>
                <button
                  onClick={() => navigate(`/rgpd-salarie?salarieId=${dirigeant.id}&print=1`)}
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                >
                  <Printer size={14} /> Imprimer
                </button>
                <button
                  onClick={() => {
                    if (confirm('Supprimer ce dirigeant ?')) del.mutate({ id: dirigeant.id });
                  }}
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 8, padding: '8px', cursor: 'pointer' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
