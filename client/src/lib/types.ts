// Types de prestations
export type PrestationType = 'piercing' | 'tatouage' | 'dermographie';

// Statut RGPD
export type RGPDStatus = 'ok' | 'warning' | 'urgent' | 'expired';

// Statut d'un document
export type DocumentStatus = 'empty' | 'filled' | 'signed';

// Droits RGPD exercés
export interface RGPDRight {
  type: 'acces' | 'rectification' | 'effacement' | 'opposition';
  date: string;
  note?: string;
}

// Types de documents
export type DocumentType =
  | 'questionnaire_mineur'
  | 'fiche_tracabilite_mineur_piercing'
  | 'autorisation_parentale'
  | 'questionnaire_majeur'
  | 'fiche_seance_piercing'
  | 'soins_oreilles'
  | 'soins_nez'
  | 'soins_nombril'
  | 'soins_mamelons'
  | 'soins_arcade_sourcil'
  | 'soins_surface_dermal'
  | 'soins_bouche_levres'
  | 'soins_mineur_oreilles'
  | 'soins_mineur_nez'
  | 'soins_mineur_bouche_levres'
  | 'soins_mineur_nombril'
  | 'soins_mineur_mamelons'
  | 'soins_mineur_arcade_sourcil'
  | 'soins_mineur_surface_dermal'
  | 'questionnaire_tatouage_mineur'
  | 'autorisation_parentale_tatouage'
  | 'questionnaire_tatouage_majeur'
  | 'questionnaire_dermographe_mineur'
  | 'autorisation_parentale_dermographie'
  | 'questionnaire_dermographe'
  | 'consentement_soins_tatouage'
  | 'soins_dermographe'
  | 'soins_dermographe_majeur'
  | 'engagement_confidentialite'
  | 'affichage_salon'
  | 'archivage_dossier_papier'
  | 'fiche_seance_tatouage'
  | 'fiche_tracabilite_majeur_tatouage'
  | 'fiche_seance_dermographe'
  | 'fiche_tracabilite_majeur_dermographe'
  | 'consentement_soins_tatouage_mineur'
;

// Document rempli
export interface ClientDocument {
  id: string;
  type: DocumentType;
  status: DocumentStatus;
  data: Record<string, unknown>;
  signatureClient?: string;
  signatureProfessionnel?: string;
  signatureRepresentant?: string;
  dateCreation: string;
  dateSigned?: string;
}

// Prestation
export interface Prestation {
  id: string;
  date: string;
  type: PrestationType;
  zone: string;
  description?: string;
  documents: string[];
  photos: string[];
}

// Client principal
export interface Client {
  id: string;
  numeroClient?: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone: string;
  email?: string;
  pieceIdentiteType?: 'CNI' | 'Passeport' | 'Permis' | 'Autre';
  pieceIdentiteNumero?: string;
  estMineur: boolean;
  nomRepresentantLegal?: string;
  prenomRepresentantLegal?: string;
  lienRepresentantLegal?: string;
  telephoneRepresentantLegal?: string;
  estSalarie?: boolean;
  prestations: Prestation[];
  documentsAssocies: DocumentType[];
  documents: ClientDocument[];
  photos: { id: string; uri: string; date: string; label?: string }[];
  dateCreation: string;
  dateConsentement?: string;
  dateSuppressionPrevue: string;
  rgpdStatus: RGPDStatus;
  rgpdDroitsExerces: RGPDRight[];
  estArchive: boolean;
  dateArchivage?: string;
  dateModification?: string;
  notes?: string;
  prestationsSouhaitees?: string[];
  zoneATatouer?: string;
  praticien?: string;
  zoneDermographie?: string[];
}

// Informations du salon
export interface SalonInfo {
  nom: string;
  raisonSociale?: string;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone: string;
  email: string;
  siret: string;
  siren?: string;
  nomPierceur: string;
  nomTatoueur?: string;
  nomDermographe?: string;
  logo?: string; // base64 data URL
  mentionsLegales?: string; // ligne libre affichée dans le pied de page imprimable
  siteWeb?: string; // URL du site web du salon
  specialites?: { piercing: boolean; tatouage: boolean; dermographie: boolean; };
}

// Statistiques du tableau de bord
export interface DashboardStats {
  totalClients: number;
  clientsActifs: number;
  clientsMajeurs: number;
  clientsMineurs: number;
  clientsArchives: number;
  alertesRGPD: number;
  alertesUrgentes: number;
}

// Rendez-vous
export type RDVStatut = 'confirme' | 'en_attente' | 'annule' | 'termine';
export type RDVType = 'piercing' | 'tatouage' | 'dermographie' | 'consultation' | 'retouche' | 'autre';

export interface RendezVous {
  id: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  clientId?: string;
  clientNom?: string;
  clientTelephone?: string;
  type: RDVType;
  zone?: string;
  notes?: string;
  statut: RDVStatut;
  dateCreation: string;
}

export const RDV_TYPE_LABELS: Record<RDVType, string> = {
  piercing: 'Piercing',
  tatouage: 'Tatouage',
  dermographie: 'Dermographie',
  consultation: 'Consultation',
  retouche: 'Retouche',
  autre: 'Autre',
};

export const RDV_STATUT_LABELS: Record<RDVStatut, string> = {
  confirme: 'Confirmé',
  en_attente: 'En attente',
  annule: 'Annulé',
  termine: 'Terminé',
};

export const RDV_STATUT_COLORS: Record<RDVStatut, string> = {
  confirme: '#4CAF50',
  en_attente: '#FF9800',
  annule: '#F44336',
  termine: '#9C27B0',
};

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  // Piercing — Mineurs
  questionnaire_mineur: '01 — Questionnaire Médical Mineur / Autorisation Parentale / Piercing',
  fiche_tracabilite_mineur_piercing: '02 — Fiche de Traçabilité Mineur Matériel Stérile',
  // Piercing — Majeurs
  questionnaire_majeur: '03 — Questionnaire Médical Majeur (Piercing)',
  fiche_seance_piercing: '04 — Fiche de Traçabilité Majeur Matériel Stérile',
  // Soins Piercing
  soins_oreilles: 'A — Soins Majeur Post-Piercing Oreilles',
  soins_nez: 'B — Soins Majeur Post-Piercing Nez',
  soins_bouche_levres: 'C — Soins Majeur Post-Piercing Labret (Bouche & Lèvres)',
  soins_nombril: 'D — Soins Majeur Post-Piercing Nombril',
  soins_mamelons: 'E — Soins Majeur Post-Piercing Téton',
  soins_arcade_sourcil: 'F — Soins Majeur Post-Piercing Arcade / Sourcil',
  soins_surface_dermal: 'G — Soins Majeur Post-Piercing Surface / Dermal',
  // Soins Piercing — Mineurs
  soins_mineur_oreilles: 'H — Soins Mineur Post-Piercing Oreilles',
  soins_mineur_nez: 'I — Soins Mineur Post-Piercing Nez',
  soins_mineur_bouche_levres: 'J — Soins Mineur Post-Piercing Labret (Bouche & Lèvres)',
  soins_mineur_nombril: 'K — Soins Mineur Post-Piercing Nombril',
  soins_mineur_mamelons: 'L — Soins Mineur Post-Piercing Téton',
  soins_mineur_arcade_sourcil: 'M — Soins Mineur Post-Piercing Arcade / Sourcil',
  soins_mineur_surface_dermal: 'N — Soins Mineur Post-Piercing Surface / Dermal',
  // Tatouage
  questionnaire_tatouage_mineur: '05 — Questionnaire Médical Mineur / Autorisation Parentale / Tatouage',
  questionnaire_tatouage_majeur: '06 — Questionnaire Médical Tatouage Majeur',
  fiche_tracabilite_majeur_tatouage: '08 — Fiche de Traçabilité Majeur Matériel Stérile (Tatouage)',
  fiche_seance_tatouage: '07 — Fiche de Traçabilité Mineur Matériel Stérile (Tatouage)',
  consentement_soins_tatouage: '09 — Soins Majeur Post-Tatouage',
  consentement_soins_tatouage_mineur: '10 — Soins Mineur Post-Tatouage',
  // Dermographie
  questionnaire_dermographe_mineur: '11 — Questionnaire Médical Mineur / Autorisation Parentale / Dermographie',
  questionnaire_dermographe: '12 — Questionnaire Médical Dermographie Majeur',
  fiche_tracabilite_majeur_dermographe: '14 — Fiche de Traçabilité Majeur Matériel Stérile (Dermographie)',
  fiche_seance_dermographe: '13 — Fiche de Traçabilité Mineur Matériel Stérile (Dermographie)',
  soins_dermographe: '15 — Soins Mineur Post-Dermographie',
  soins_dermographe_majeur: '16 — Soins Majeur Post-Dermographie',
  // RGPD
  engagement_confidentialite: '17 — Engagement de Confidentialité (RGPD Art. 29)',
  affichage_salon: '18 — Information Client — Protection des Données (RGPD)',
  archivage_dossier_papier: '19 — Archivage Dossier Papier',
  dossier_mineur_piercing: '20 — Dossier Complet Mineur Piercing',
};

export function calculateRGPDStatus(dateSuppressionPrevue: string): RGPDStatus {
  const now = new Date();
  const suppDate = new Date(dateSuppressionPrevue);
  const diffDays = Math.floor((suppDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 30) return 'urgent';
  if (diffDays <= 90) return 'warning';
  return 'ok';
}
