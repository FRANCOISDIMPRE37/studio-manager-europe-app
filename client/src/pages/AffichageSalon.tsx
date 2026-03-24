import { useLocation } from 'wouter';
import { Info, ChevronLeft, Eye, Database, Lock, UserCheck, Phone, Shield } from 'lucide-react';

export default function AffichageSalon() {
  const [, navigate] = useLocation();

  const sections = [
    {
      icon: <Database size={18} />,
      title: 'Responsable du traitement',
      content:
        'Le salon collecte et traite vos données personnelles en qualité de responsable du traitement, conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679).',
    },
    {
      icon: <Info size={18} />,
      title: 'Finalités du traitement',
      content:
        'Vos données (nom, prénom, date de naissance, coordonnées, informations médicales) sont collectées uniquement pour : la réalisation de la prestation, le suivi médical post-prestation, la gestion des rendez-vous et la conformité légale (traçabilité du matériel stérile).',
    },
    {
      icon: <Lock size={18} />,
      title: 'Base légale',
      content:
        "Le traitement est fondé sur votre consentement explicite (Art. 6.1.a RGPD) et sur l'exécution du contrat de prestation (Art. 6.1.b RGPD). Pour les données de santé, la base légale est votre consentement explicite (Art. 9.2.a RGPD).",
    },
    {
      icon: <Eye size={18} />,
      title: 'Durée de conservation',
      content:
        'Vos données sont conservées pendant la durée de la relation commerciale, puis archivées pour une durée maximale de 5 ans conformément aux obligations légales. Les données de traçabilité du matériel stérile sont conservées 10 ans.',
    },
    {
      icon: <UserCheck size={18} />,
      title: 'Vos droits',
      content:
        "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition à vos données personnelles. Vous pouvez exercer ces droits à tout moment auprès du salon.",
    },
    {
      icon: <Phone size={18} />,
      title: 'Exercer vos droits',
      content:
        'Pour exercer vos droits ou pour toute question relative à la protection de vos données, contactez directement le salon. En cas de litige, vous pouvez saisir la CNIL (www.cnil.fr) ou tout tribunal compétent.',
    },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm mb-6"
        style={{ color: 'var(--brand-cyan)' }}
      >
        <ChevronLeft size={16} />
        Retour
      </button>

      <div className="flex items-center gap-3 mb-2">
        <Info size={28} style={{ color: 'var(--brand-cyan)' }} />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-cyan)' }}>
          Information Client — Protection des Données
        </h1>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--brand-text-muted)' }}>
        Doc 12 — RGPD Art. 13 &amp; 14 · Affichage obligatoire dans le salon
      </p>

      <div
        className="rounded-xl p-4 mb-6 flex items-start gap-3"
        style={{ background: 'rgba(0,188,212,0.08)', border: '1px solid rgba(0,188,212,0.25)' }}
      >
        <Shield size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--brand-cyan)' }} />
        <p className="text-sm" style={{ color: 'var(--brand-text)' }}>
          Ce document doit être affiché de manière visible dans le salon (accueil, espace
          d&apos;attente) conformément aux articles 13 et 14 du RGPD. Il informe les clients de
          leurs droits avant toute prestation.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="rounded-xl p-5"
            style={{ background: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: 'var(--brand-cyan)' }}>{section.icon}</span>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--brand-cyan)' }}>
                {section.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-text)' }}>
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.print()}
        className="w-full py-3 rounded-xl font-semibold text-sm"
        style={{ background: 'var(--brand-cyan)', color: 'var(--brand-navy)' }}
      >
        Imprimer / Générer PDF
      </button>
    </div>
  );
}
