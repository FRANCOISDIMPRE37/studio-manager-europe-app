/*
 * DESIGN: Studio Nocturne — Page RGPD & Confidentialité (Hub)
 */
import { Shield, Lock, Monitor, ChevronRight, Users } from "lucide-react";
import { useLocation } from "wouter";
import { useApp } from "@/lib/app-context";

export default function Rgpd() {
  const [, navigate] = useLocation();
  const { getDashboardStats } = useApp();
  const stats = getDashboardStats();

  const sections = [
    {
      path: "/rgpd-salarie",
      icon: Lock,
      color: "#E53935",
      bg: "rgba(229, 57, 53, 0.15)",
      bgHover: "rgba(229, 57, 53, 0.05)",
      border: "rgba(229, 57, 53, 0.2)",
      title: "RGPD Salarié(s)",
      subtitle: "Doc 11 — Engagement de Confidentialité",
      description: "Engagement de confidentialité pour les salariés et prestataires du salon (RGPD Art. 29).",
    },
    {
      path: "/affichage-salon",
      icon: Monitor,
      color: "var(--brand-cyan)",
      bg: "rgba(131, 208, 245, 0.15)",
      bgHover: "rgba(131, 208, 245, 0.05)",
      border: "rgba(131, 208, 245, 0.2)",
      title: "Affichage dans le salon",
      subtitle: "Doc 12 — Information Client — Protection des Données",
      description: "Information obligatoire sur la protection des données à afficher dans le salon (RGPD Art. 13 & 14).",
    },
    {
      path: "/clients",
      icon: Users,
      color: "#9C27B0",
      bg: "rgba(156, 39, 176, 0.15)",
      bgHover: "rgba(156, 39, 176, 0.05)",
      border: "rgba(156, 39, 176, 0.2)",
      title: "Droits des clients",
      subtitle: "Gestion des droits RGPD — Accès, Rectification, Effacement",
      description: `${stats.alertesRGPD} alerte(s) RGPD active(s) · ${stats.totalClients} client(s) enregistré(s)`,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-700" style={{ color: "var(--brand-text)", fontFamily: "Outfit", fontWeight: 700 }}>
          RGPD & Confidentialité
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--brand-text-muted)" }}>
          Conformité au Règlement Général sur la Protection des Données
        </p>
      </div>

      <div className="p-4 rounded-xl" style={{ background: "rgba(229, 57, 53, 0.05)", border: "1px solid rgba(229, 57, 53, 0.2)" }}>
        <div className="flex items-start gap-3">
          <Shield size={18} style={{ color: "#E53935", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-sm font-600" style={{ color: "#E53935", fontWeight: 600 }}>Conformité RGPD — Règlement (UE) 2016/679</p>
            <p className="text-xs mt-1" style={{ color: "var(--brand-text-muted)" }}>
              Ces documents garantissent la conformité du salon au Règlement Général sur la Protection des Données.
              Conservation des données de santé : 3 ans. Les clients peuvent exercer leurs droits à tout moment via{" "}
              <span style={{ color: "var(--brand-cyan)" }}>francois-dimpre@intemporelle.eu</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-600" style={{ color: "var(--brand-text)", fontWeight: 600 }}>Sections RGPD</h2>
        {sections.map(({ path, icon: Icon, color, bg, bgHover, border, title, subtitle, description }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:opacity-90"
            style={{ background: bgHover, border: `1px solid ${border}` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: bg }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-700" style={{ color: "var(--brand-text)", fontWeight: 700, fontFamily: "Outfit" }}>
                {title}
              </p>
              <p className="text-xs mt-0.5 font-500" style={{ color, fontWeight: 500 }}>
                {subtitle}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--brand-text-muted)" }}>
                {description}
              </p>
            </div>
            <ChevronRight size={18} style={{ color: "var(--brand-text-muted)", flexShrink: 0 }} />
          </button>
        ))}
      </div>

      <div className="studio-card p-4">
        <h2 className="text-sm font-600 mb-3" style={{ color: "var(--brand-text)", fontWeight: 600 }}>
          Droits des personnes concernées
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { art: "Art. 15", label: "Droit d'accès" },
            { art: "Art. 16", label: "Droit de rectification" },
            { art: "Art. 17", label: "Droit à l'effacement" },
            { art: "Art. 21", label: "Droit d'opposition" },
          ].map(({ art, label }) => (
            <div key={art} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(131,208,245,0.05)", border: "1px solid rgba(131,208,245,0.1)" }}>
              <span className="text-xs font-700" style={{ color: "var(--brand-cyan)", fontWeight: 700, fontFamily: "Outfit" }}>{art}</span>
              <span className="text-xs" style={{ color: "var(--brand-text-muted)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="studio-card p-4 text-xs space-y-2" style={{ color: "var(--brand-text-muted)" }}>
        <p style={{ fontWeight: 600, color: "var(--brand-text)" }}>Base légale & mentions</p>
        <p>L''écrit électronique a la même force probante que l''écrit papier (Art. 1366 du Code civil).</p>
        <p>Le salon s''éngage à ne pas utiliser les données personnelles à des fins publicitaires.</p>
        <p>Conservation (mineurs) : 3 ans minimum à compter de la majorité du mineur (Art. L1110-4 CSP).</p>
      </div>

      <div className="text-center py-4">
        <p className="text-xs" style={{ color: "var(--brand-text-muted)" }}>
          Documents fournis par <span style={{ color: "var(--brand-cyan)" }}>Intemporelle</span> — RGPD & Cybersécurité · Tours (37)
        </p>
      </div>
    </div>
  );
}
