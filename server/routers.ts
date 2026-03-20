import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import nodemailer from "nodemailer";
import {
  getClientsByUserId, getClientById, createClient, updateClientById, deleteClientById,
  getPrestationsByClientId, createPrestation, deletePrestationById,
  getDocumentsByClientId, getDocumentById, createDocument, updateDocumentById,
  getRDVByUserId, createRDV, updateRDVById, deleteRDVById,
  getSalonSettings, upsertSalonSettings,
  getSmtpConfig, upsertSmtpConfig,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  clients: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getClientsByUserId(ctx.user.id);
    }),
    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return getClientById(input.id, ctx.user.id);
      }),
    create: protectedProcedure
      .input(z.object({
        id: z.string(),
        nom: z.string(),
        prenom: z.string(),
        dateNaissance: z.string(),
        adresse: z.string().optional(),
        codePostal: z.string().optional(),
        ville: z.string().optional(),
        telephone: z.string(),
        email: z.string().optional(),
        pieceIdentiteType: z.enum(["CNI", "Passeport", "Permis", "Autre"]).optional(),
        pieceIdentiteNumero: z.string().optional(),
        estMineur: z.boolean().default(false),
        estArchive: z.boolean().default(false),
        dateArchivage: z.string().optional(),
        dateConsentement: z.string().optional(),
        dateSuppressionPrevue: z.string(),
        rgpdDroitsExerces: z.array(z.object({
          type: z.string(), date: z.string(), note: z.string().optional(),
        })).default([]),
      }))
      .mutation(async ({ ctx, input }) => {
        return createClient({ ...input, userId: ctx.user.id });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        nom: z.string().optional(),
        prenom: z.string().optional(),
        dateNaissance: z.string().optional(),
        adresse: z.string().optional(),
        codePostal: z.string().optional(),
        ville: z.string().optional(),
        telephone: z.string().optional(),
        email: z.string().optional(),
        pieceIdentiteType: z.enum(["CNI", "Passeport", "Permis", "Autre"]).optional(),
        pieceIdentiteNumero: z.string().optional(),
        estMineur: z.boolean().optional(),
        estArchive: z.boolean().optional(),
        dateArchivage: z.string().optional(),
        dateConsentement: z.string().optional(),
        dateSuppressionPrevue: z.string().optional(),
        rgpdDroitsExerces: z.array(z.object({
          type: z.string(), date: z.string(), note: z.string().optional(),
        })).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await updateClientById(id, ctx.user.id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await deleteClientById(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  prestations: router({
    listByClient: protectedProcedure
      .input(z.object({ clientId: z.string() }))
      .query(async ({ ctx, input }) => {
        return getPrestationsByClientId(input.clientId, ctx.user.id);
      }),
    create: protectedProcedure
      .input(z.object({
        id: z.string(),
        clientId: z.string(),
        date: z.string(),
        type: z.enum(["piercing", "tatouage", "dermographie"]),
        zone: z.string(),
        description: z.string().optional(),
        photos: z.array(z.string()).default([]),
      }))
      .mutation(async ({ ctx, input }) => {
        return createPrestation({ ...input, userId: ctx.user.id });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await deletePrestationById(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  documents: router({
    listByClient: protectedProcedure
      .input(z.object({ clientId: z.string() }))
      .query(async ({ ctx, input }) => {
        return getDocumentsByClientId(input.clientId, ctx.user.id);
      }),
    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return getDocumentById(input.id, ctx.user.id);
      }),
    create: protectedProcedure
      .input(z.object({
        id: z.string(),
        clientId: z.string(),
        type: z.string(),
        status: z.enum(["empty", "filled", "signed"]).default("empty"),
        data: z.record(z.string(), z.unknown()).default({}),
        signatureClient: z.string().optional(),
        signatureProfessionnel: z.string().optional(),
        signatureRepresentant: z.string().optional(),
        dateSigned: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createDocument({ ...input, userId: ctx.user.id });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        status: z.enum(["empty", "filled", "signed"]).optional(),
        data: z.record(z.string(), z.unknown()).optional(),
        signatureClient: z.string().optional(),
        signatureProfessionnel: z.string().optional(),
        signatureRepresentant: z.string().optional(),
        dateSigned: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await updateDocumentById(id, ctx.user.id, data);
        return { success: true };
      }),
  }),

  rdv: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getRDVByUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        id: z.string(),
        clientId: z.string().optional(),
        clientNom: z.string().optional(),
        clientTelephone: z.string().optional(),
        date: z.string(),
        heureDebut: z.string(),
        heureFin: z.string(),
        type: z.enum(["piercing", "tatouage", "dermographie", "consultation", "retouche", "autre"]),
        zone: z.string().optional(),
        notes: z.string().optional(),
        statut: z.enum(["confirme", "en_attente", "annule", "termine"]).default("confirme"),
      }))
      .mutation(async ({ ctx, input }) => {
        return createRDV({ ...input, userId: ctx.user.id });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        clientId: z.string().optional(),
        clientNom: z.string().optional(),
        clientTelephone: z.string().optional(),
        date: z.string().optional(),
        heureDebut: z.string().optional(),
        heureFin: z.string().optional(),
        type: z.enum(["piercing", "tatouage", "dermographie", "consultation", "retouche", "autre"]).optional(),
        zone: z.string().optional(),
        notes: z.string().optional(),
        statut: z.enum(["confirme", "en_attente", "annule", "termine"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await updateRDVById(id, ctx.user.id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await deleteRDVById(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  salon: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return getSalonSettings(ctx.user.id);
    }),
    update: protectedProcedure
      .input(z.object({
        nom: z.string().optional(),
        raisonSociale: z.string().optional(),
        adresse: z.string().optional(),
        codePostal: z.string().optional(),
        ville: z.string().optional(),
        telephone: z.string().optional(),
        email: z.string().optional(),
        siret: z.string().optional(),
        nomPierceur: z.string().optional(),
        nomTatoueur: z.string().optional(),
        nomDermographe: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await upsertSalonSettings(ctx.user.id, input);
        return { success: true };
      }),
  }),

  smtp: router({
    // Récupérer la config SMTP (mot de passe masqué)
    get: protectedProcedure.query(async ({ ctx }) => {
      const config = await getSmtpConfig(ctx.user.id);
      if (!config) return null;
      return {
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: config.user,
        passwordSet: config.password.length > 0,
        fromName: config.fromName,
        replyTo: config.replyTo,
      };
    }),
    // Sauvegarder la config SMTP
    save: protectedProcedure
      .input(z.object({
        host: z.string().min(1),
        port: z.number().int().min(1).max(65535),
        secure: z.boolean(),
        user: z.string().min(1),
        password: z.string().optional(), // vide = ne pas changer
        fromName: z.string().optional(),
        replyTo: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await getSmtpConfig(ctx.user.id);
        const password = input.password && input.password.length > 0
          ? input.password
          : (existing?.password ?? '');
        await upsertSmtpConfig(ctx.user.id, {
          host: input.host,
          port: input.port,
          secure: input.secure,
          user: input.user,
          password,
          fromName: input.fromName ?? null,
          replyTo: input.replyTo ?? null,
        });
        return { success: true };
      }),
    // Tester la connexion SMTP
    test: protectedProcedure.mutation(async ({ ctx }) => {
      const config = await getSmtpConfig(ctx.user.id);
      if (!config || !config.user || !config.password) {
        throw new Error('Configuration SMTP incomplète. Veuillez d\'abord sauvegarder vos paramètres.');
      }
      try {
        const transporter = nodemailer.createTransport({
          host: config.host,
          port: config.port,
          secure: config.secure,
          auth: { user: config.user, pass: config.password },
          tls: { rejectUnauthorized: false },
        });
        await transporter.verify();
        return { success: true, message: 'Connexion SMTP réussie !' };
      } catch (err: any) {
        throw new Error(`Échec de connexion SMTP : ${err.message}`);
      }
    }),
    // Envoyer un email avec le contenu d'une fiche
    sendDocument: protectedProcedure
      .input(z.object({
        to: z.string().email(),
        subject: z.string(),
        body: z.string(),
        documentTitle: z.string(),
        clientNom: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const config = await getSmtpConfig(ctx.user.id);
        if (!config || !config.user || !config.password) {
          throw new Error('Configuration SMTP non configurée. Rendez-vous dans Paramètres > Configuration Email.');
        }
        const salon = await getSalonSettings(ctx.user.id);
        const fromName = config.fromName || salon?.nom || 'Studio Manager';
        try {
          const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: { user: config.user, pass: config.password },
            tls: { rejectUnauthorized: false },
          });
          await transporter.sendMail({
            from: `"${fromName}" <${config.user}>`,
            to: input.to,
            replyTo: config.replyTo || config.user,
            subject: input.subject,
            html: `<div style="font-family:sans-serif;max-width:600px;margin:auto">
              <h2 style="color:#0A1628">${input.documentTitle}</h2>
              <p>Bonjour ${input.clientNom},</p>
              ${input.body}
              <hr style="margin:24px 0;border:none;border-top:1px solid #eee">
              <p style="font-size:12px;color:#888">${fromName} — ${salon?.adresse || ''} ${salon?.ville || ''}</p>
            </div>`,
          });
          return { success: true };
        } catch (err: any) {
          throw new Error(`Échec d'envoi : ${err.message}`);
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
