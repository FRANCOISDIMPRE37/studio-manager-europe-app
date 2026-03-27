/**
 * PAGE À PROPOS — Propriété Intemporelle
 * Accessible depuis Paramètres > À propos
 * Affiche les coordonnées Intemporelle, la mention de propriété du logiciel
 * et les informations légales pour le client revendeur
 */
import { Phone, Mail, Globe, Shield, Lock, Info, ExternalLink } from 'lucide-react';

export default function APropos() {
  const cardStyle: React.CSSProperties = {
    background: 'rgba(15, 32, 64, 0.6)',
    border: '1px solid var(--brand-border)',
    borderRadius: '0.75rem',
    padding: '1.25rem',
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl">
      <h1 className="text-xl font-700" style={{ color: 'var(--brand-text)', fontFamily: 'Outfit', fontWeight: 700 }}>
        À propos
      </h1>

      {/* Bloc principal Intemporelle */}
      <div style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(10,22,40,0.95) 0%, rgba(17,32,64,0.95) 100%)', border: '1px solid rgba(201,168,76,0.3)' }}>
        <div className="flex items-center gap-4 mb-4">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663159292899/kHAXDDN9mqMmBLtorFtFyT/logo_white_d12a3c81.svg"
            alt="Intemporelle"
            className="w-14 h-14"
          />
          <div>
            <h2 className="text-lg font-700" style={{ color: 'white', fontFamily: 'Outfit', fontWeight: 700 }}>
              Studio Manager
            </h2>
            <p className="text-sm" style={{ color: 'rgba(201,168,76,0.9)' }}>by Société Intemporelle</p>
          </div>
        </div>

        <div
          className="p-3 rounded-lg mb-4"
          style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
        >
          <p className="text-xs font-600" style={{ color: 'rgba(201,168,76,0.95)', lineHeight: 1.7, fontWeight: 600 }}>
            ⚖️ Cette application est la <strong>propriété exclusive de la Société Intemporelle</strong>.
            La tablette et le logiciel sont mis à disposition sous licence. Toute reproduction,
            modification ou redistribution est strictement interdite sans autorisation écrite.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-600 uppercase tracking-wider mb-2" style={{ color: 'var(--brand-text-muted)', fontWeight: 600, fontSize: '10px' }}>
            Contact & Support
          </p>
          {[
            { icon: Phone, label: '06.17.07.41.69', href: 'tel:+33617074169' },
            { icon: Mail, label: 'francois-dimpre@intemporelle.eu', href: 'mailto:francois-dimpre@intemporelle.eu' },
            { icon: Globe, label: 'www.intemporelle.eu', href: 'https://www.intemporelle.eu' },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={href}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-lg transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--brand-border)', color: 'var(--brand-text)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--brand-cyan)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--brand-border)')}
            >
              <Icon size={15} style={{ color: 'var(--brand-cyan)', flexShrink: 0 }} />
              <span className="text-sm">{label}</span>
              {href.startsWith('http') && <ExternalLink size={12} style={{ color: 'var(--brand-text-muted)', marginLeft: 'auto' }} />}
            </a>
          ))}
        </div>
      </div>

      {/* Données clients */}
      <div style={cardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Lock size={16} style={{ color: 'var(--brand-cyan)' }} />
          <h3 className="text-sm font-600" style={{ color: 'var(--brand-text)', fontWeight: 600 }}>Vos données clients</h3>
        </div>
        <p className="text-xs" style={{ color: 'var(--brand-text-muted)', lineHeight: 1.7 }}>
          Toutes les données de vos clients sont stockées <strong style={{ color: 'var(--brand-text)' }}>exclusivement sur cette tablette</strong>,
          dans le navigateur local. Elles ne sont jamais transmises à des serveurs externes.
          Vous en êtes le seul propriétaire et responsable de traitement au sens du RGPD.
        </p>
      </div>

      {/* Conformité RGPD */}
      <div style={cardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} style={{ color: 'var(--brand-cyan)' }} />
          <h3 className="text-sm font-600" style={{ color: 'var(--brand-text)', fontWeight: 600 }}>Conformité RGPD</h3>
        </div>
        <div className="space-y-2">
          {[
            'Conforme à l\'Arrêté du 3 décembre 2008 (piercing & tatouage)',
            'Gestion des durées de conservation (5 ans)',
            'Exercice des droits RGPD (accès, rectification, effacement)',
            'Engagement de confidentialité Art. 29 pour collaborateurs',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span style={{ color: '#4CAF50', flexShrink: 0, marginTop: 1 }}>✓</span>
              <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Version */}
      <div style={{ ...cardStyle, padding: '1rem' }}>
        <div className="flex items-center gap-2 mb-2">
          <Info size={14} style={{ color: 'var(--brand-text-muted)' }} />
          <span className="text-xs font-600" style={{ color: 'var(--brand-text-muted)', fontWeight: 600 }}>Informations techniques</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'var(--brand-text-muted)' }}>
          <span>Version</span><span style={{ color: 'var(--brand-text)' }}>Mars 2026</span>
          <span>Propriétaire</span><span style={{ color: 'var(--brand-text)' }}>Société Intemporelle</span>
          <span>Licence</span><span style={{ color: 'var(--brand-text)' }}>Usage exclusif — non transférable</span>
          <span>Support</span><span style={{ color: 'var(--brand-cyan)' }}>06.17.07.41.69</span>
        </div>
      </div>
    </div>
  );
}
