import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: studios, isLoading } = trpc.admin.listStudios.useQuery(undefined, {
    retry: false,
  });

  const deleteUser = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("Compte supprimé avec succès");
      setConfirmDelete(null);
      utils.admin.listStudios.invalidate();
    },
    onError: (err) => {
      toast.error("Erreur : " + err.message);
      setConfirmDelete(null);
    },
  });

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--brand-navy)" }}>
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Panneau d'administration</h1>
            <p style={{ color: "var(--brand-text-muted)" }}>Gestion de tous les studios clients</p>
          </div>
          <button
            onClick={() => setLocation("/")}
            className="text-sm underline"
            style={{ color: "var(--brand-accent)" }}
          >
            ← Retour au studio
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card style={{ background: "var(--brand-card)", border: "1px solid var(--brand-border)" }}>
            <CardContent className="pt-6">
              <p className="text-4xl font-bold text-white">{studios?.length ?? 0}</p>
              <p style={{ color: "var(--brand-text-muted)" }}>Studios inscrits</p>
            </CardContent>
          </Card>
          <Card style={{ background: "var(--brand-card)", border: "1px solid var(--brand-border)" }}>
            <CardContent className="pt-6">
              <p className="text-4xl font-bold" style={{ color: "var(--brand-accent)" }}>
                {studios?.filter(s => s.loginMethod === "email").length ?? 0}
              </p>
              <p style={{ color: "var(--brand-text-muted)" }}>Comptes email</p>
            </CardContent>
          </Card>
          <Card style={{ background: "var(--brand-card)", border: "1px solid var(--brand-border)" }}>
            <CardContent className="pt-6">
              <p className="text-4xl font-bold text-green-400">
                {studios?.filter(s => s.loginMethod !== "email").length ?? 0}
              </p>
              <p style={{ color: "var(--brand-text-muted)" }}>Comptes PIN (propriétaire)</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des studios */}
        <Card style={{ background: "var(--brand-card)", border: "1px solid var(--brand-border)" }}>
          <CardHeader>
            <CardTitle className="text-white">Studios clients</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p style={{ color: "var(--brand-text-muted)" }}>Chargement...</p>
            ) : studios && studios.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--brand-border)" }}>
                      <th className="text-left py-2 px-3 text-white">ID</th>
                      <th className="text-left py-2 px-3 text-white">Nom du salon</th>
                      <th className="text-left py-2 px-3 text-white">Email</th>
                      <th className="text-left py-2 px-3 text-white">Méthode</th>
                      <th className="text-left py-2 px-3 text-white">Rôle</th>
                      <th className="text-left py-2 px-3 text-white">Inscrit le</th>
                      <th className="text-left py-2 px-3 text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studios.map((studio) => (
                      <tr
                        key={studio.id}
                        style={{ borderBottom: "1px solid var(--brand-border)" }}
                      >
                        <td className="py-2 px-3" style={{ color: "var(--brand-text-muted)" }}>
                          #{studio.id}
                        </td>
                        <td className="py-2 px-3 text-white font-medium">
                          {studio.name || "—"}
                        </td>
                        <td className="py-2 px-3" style={{ color: "var(--brand-text-muted)" }}>
                          {studio.email || "—"}
                        </td>
                        <td className="py-2 px-3">
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: studio.loginMethod === "email" ? "var(--brand-accent)" : "#22c55e",
                              color: studio.loginMethod === "email" ? "var(--brand-accent)" : "#22c55e",
                            }}
                          >
                            {studio.loginMethod === "email" ? "Email" : "PIN"}
                          </Badge>
                        </td>
                        <td className="py-2 px-3">
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: studio.role === "admin" ? "#f59e0b" : "#6b7280",
                              color: studio.role === "admin" ? "#f59e0b" : "#6b7280",
                            }}
                          >
                            {studio.role}
                          </Badge>
                        </td>
                        <td className="py-2 px-3" style={{ color: "var(--brand-text-muted)" }}>
                          {new Date(studio.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-2 px-3">
                          {confirmDelete === studio.id ? (
                            <div className="flex gap-2 items-center">
                              <span className="text-red-400 text-xs">Confirmer ?</span>
                              <button
                                onClick={() => deleteUser.mutate({ userId: studio.id })}
                                disabled={deleteUser.isPending}
                                className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                              >
                                {deleteUser.isPending ? "..." : "Oui"}
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-xs px-2 py-1 rounded bg-gray-600 text-white hover:bg-gray-700"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(studio.id)}
                              className="text-xs px-2 py-1 rounded border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                            >
                              Supprimer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: "var(--brand-text-muted)" }}>
                Aucun studio inscrit pour le moment.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
