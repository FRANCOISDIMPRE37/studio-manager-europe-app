/*
 * DESIGN: Studio Nocturne — Modal d'ajout de client
 * Validation: erreurs uniquement après blur (touched) ou soumission
 * Version 3 — approche touched par champ, impossible d'afficher des erreurs à l'ouverture
 */
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DocumentType } from '@/lib/types';
import { toast } from 'sonner';

const DOCS_MINEURS: DocumentType[] = ['questionnaire_mineur'];

// Correspondance prestation souhaitée → documents associés
const PRESTATION_DOCS_MAJEUR: Record<string, DocumentType[]> = {
  'Oreilles':          ['questionnaire_majeur', 'fiche_seance_piercing', 'soins_oreilles'],
  'Nez':               ['questionnaire_majeur', 'fiche_seance_piercing', 'soins_nez'],
  'Nombril':           ['questionnaire_majeur', 'fiche_seance_piercing', 'soins_nombril'],
  'Téton':             ['questionnaire_majeur', 'fiche_seance_piercing', 'soins_mamelons'],
  'Arcade / Sourcil':  ['questionnaire_majeur', 'fiche_seance_piercing', 'soins_arcade_sourcil'],
  'Surface / Dermal':  ['questionnaire_majeur', 'fiche_seance_piercing', 'soins_surface_dermal'],
  'Labret':   ['questionnaire_majeur', 'fiche_seance_piercing', 'soins_bouche_levres'],
  'Tatouage':          ['questionnaire_tatouage_majeur', 'fiche_seance_tatouage', 'consentement_soins_tatouage'],
  'Dermographie':      ['questionnaire_dermographe', 'fiche_seance_dermographe', 'soins_dermographe'],
};

const PRESTATION_DOCS_MINEUR: Record<string, DocumentType[]> = {
  'Oreilles':          ['questionnaire_mineur', 'fiche_seance_piercing', 'soins_oreilles'],
  'Nez':               ['questionnaire_mineur', 'fiche_seance_piercing', 'soins_nez'],
  'Nombril':           ['questionnaire_mineur', 'fiche_seance_piercing', 'soins_nombril'],
  'Téton':             ['questionnaire_mineur', 'fiche_seance_piercing', 'soins_mamelons'],
  'Arcade / Sourcil':  ['questionnaire_mineur', 'fiche_seance_piercing', 'soins_arcade_sourcil'],
  'Surface / Dermal':  ['questionnaire_mineur', 'fiche_seance_piercing', 'soins_surface_dermal'],
  'Labret':   ['questionnaire_mineur', 'fiche_seance_piercing', 'soins_bouche_levres'],
  'Tatouage':   ['questionnaire_tatouage_mineur', 'fiche_seance_tatouage'],
  'Dermographie': ['questionnaire_dermographe_mineur', 'fiche_seance_dermographe', 'soins_dermographe'],
};

function buildDocumentsAssocies(prestations: string[], isMineur: boolean): DocumentType[] {
  const set = new Set<DocumentType>();

  const map = isMineur ? PRESTATION_DOCS_MINEUR : PRESTATION_DOCS_MAJEUR;
  for (const p of prestations) {
    const docs = map[p] || [];
    docs.forEach(d => set.add(d));
  }
  const result = Array.from(set);
  return result;
}

interface Props {
  onClose: () => void;
  client?: any;
}

function calcAge(j: string, m: string, a: string): number {
  if (!j || !m || !a || a.length < 4) return -1;
  const birth = new Date(parseInt(a), parseInt(m) - 1, parseInt(j));
  if (isNaN(birth.getTime())) return -1;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const diff = now.getMonth() - birth.getMonth();
  if (diff < 0 || (diff === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export default function AddClientModal({ onClose, client: initialClient }: Props) {
  const { addClient, updateClient } = useApp();
  const [currentClient, setCurrentClient] = useState(initialClient);

  // Champs du formulaire
  const [prenom, setPrenom] = useState(initialClient?.prenom || '');
  const [nom, setNom] = useState(initialClient?.nom || '');
  
  const parseDateISO = (dateISO: string | undefined) => {
    if (!dateISO) return { jour: '', mois: '', annee: '' };
    const parts = dateISO.split('-');
    if (parts.length === 3) {
      return { jour: parts[2], mois: parts[1], annee: parts[0] };
    }
    return { jour: '', mois: '', annee: '' };
  };
  
  const initialDate = parseDateISO(initialClient?.dateNaissance);
  const [dateJour, setDateJour] = useState(initialDate.jour);
  const [dateMois, setDateMois] = useState(initialDate.mois);
  const [dateAnnee, setDateAnnee] = useState(initialDate.annee);
  const [telephone, setTelephone] = useState(initialClient?.telephone || '');
  const [email, setEmail] = useState(initialClient?.email || '');
  const [adresse, setAdresse] = useState(initialClient?.adresse || '');
  const [codePostal, setCodePostal] = useState(initialClient?.codePostal || '');
  const [ville, setVille] = useState(initialClient?.ville || '');
  const [pieceIdentiteType, setPieceIdentiteType] = useState(initialClient?.pieceIdentiteType || '');
  const [pieceIdentiteNumero, setPieceIdentiteNumero] = useState(initialClient?.pieceIdentiteNumero || '');
  const [prestationsSouhaitees, setPrestationsSouhaitees] = useState<string[]>(initialClient?.prestationsSouhaitees || []);

  const [nomRepresentant, setNomRepresentant] = useState(initialClient?.nomRepresentant || '');
  const [prenomRepresentant, setPrenomRepresentant] = useState(initialClient?.prenomRepresentant || '');
  const [lienRepresentant, setLienRepresentant] = useState(initialClient?.lienRepresentant || '');
  const [telephoneRepresentant, setTelephoneRepresentant] = useState(initialClient?.telephoneRepresentant || '');

  const age = calcAge(dateJour, dateMois, dateAnnee);
  const isMineur = age >= 0 && age < 18;

  // Sauvegarde automatique en temps réel
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (nom.trim() || prenom.trim()) {
        const dateNaissanceISO = (dateAnnee && dateMois && dateJour) 
          ? `${dateAnnee}-${dateMois.padStart(2, '0')}-${dateJour.padStart(2, '0')}`
          : undefined;

        const clientData = {
          prenom: prenom.trim(),
          nom: nom.trim().toUpperCase(),
          dateNaissance: dateNaissanceISO,
          telephone: telephone.trim(),
          email: email.trim(),
          adresse: adresse.trim(),
          codePostal: codePostal.trim(),
          ville: ville.trim(),
          pieceIdentiteType,
          pieceIdentiteNumero,
          prestationsSouhaitees,
          nomRepresentant,
          prenomRepresentant,
          lienRepresentant,
          telephoneRepresentant,
          estMineur: isMineur
        };

        try {
          if (currentClient?.id) {
            await updateClient({ ...currentClient, ...clientData });
          } else {
            const newClient = await addClient(clientData);
            if (newClient?.id) {
              setCurrentClient(newClient);
            }
          }
        } catch (err) {
          console.error('Auto-save failed:', err);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [nom, prenom, dateJour, dateMois, dateAnnee, telephone, email, adresse, codePostal, ville, pieceIdentiteType, pieceIdentiteNumero, prestationsSouhaitees, nomRepresentant, prenomRepresentant, lienRepresentant, telephoneRepresentant, isMineur, currentClient, addClient, updateClient]);

  const togglePrestation = (p: string) => {
    setPrestationsSouhaitees(prev =>
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const touch = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getError = (field: string): string => {
    const shouldShow = submitAttempted || touched[field];
    if (!shouldShow) return '';

    switch (field) {
      case 'prenom': return !prenom.trim() ? 'Le prénom est requis' : '';
      case 'nom': return !nom.trim() ? 'Le nom est requis' : '';
      case 'telephone': return !telephone.trim() ? 'Le téléphone est requis' : '';
      case 'email': return !email.trim() ? 'L\'email est requis' : '';
      case 'date':
        if (!dateJour || !dateMois || !dateAnnee) return 'La date de naissance est requise';
        if (age < 0 || age > 120) return 'Date invalide';
        return '';
      default: return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!prenom.trim() || !nom.trim() || !telephone.trim() || !email.trim() || age < 0) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    toast.success('Client enregistré avec succès');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0B1120] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-blue-400" />
              {currentClient?.id ? 'Modifier le client' : 'Nouveau client'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">Les informations sont sauvegardées automatiquement chez OVH.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Identité</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Prénom *</label>
                <input
                  value={prenom}
                  onChange={e => setPrenom(e.target.value)}
                  onBlur={() => touch('prenom')}
                  placeholder="Ex: Marie"
                  className={`w-full bg-white/5 border ${getError('prenom') ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                />
                {getError('prenom') && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {getError('prenom')}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Nom *</label>
                <input
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  onBlur={() => touch('nom')}
                  placeholder="Ex: DUPUIS"
                  className={`w-full bg-white/5 border ${getError('nom') ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                />
                {getError('nom') && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {getError('nom')}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Date de naissance *</label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  value={dateJour}
                  onChange={e => setDateJour(e.target.value)}
                  onBlur={() => touch('date')}
                  placeholder="JJ"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <input
                  value={dateMois}
                  onChange={e => setDateMois(e.target.value)}
                  onBlur={() => touch('date')}
                  placeholder="MM"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <input
                  value={dateAnnee}
                  onChange={e => setDateAnnee(e.target.value)}
                  onBlur={() => touch('date')}
                  placeholder="AAAA"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              {getError('date') && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {getError('date')}</p>}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Téléphone *</label>
                <input
                  value={telephone}
                  onChange={e => setTelephone(e.target.value)}
                  onBlur={() => touch('telephone')}
                  placeholder="06 XX XX XX XX"
                  className={`w-full bg-white/5 border ${getError('telephone') ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Email *</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => touch('email')}
                  placeholder="exemple@email.com"
                  className={`w-full bg-white/5 border ${getError('email') ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                />
              </div>
            </div>
          </section>

          <div className="pt-6 border-t border-white/10 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-[2] px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all"
            >
              {currentClient?.id ? 'Mettre à jour' : 'Créer le client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
