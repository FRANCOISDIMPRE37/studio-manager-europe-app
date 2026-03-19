import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getClientsByUserId, getClientById, createClient, updateClientById, deleteClientById,
  getPrestationsByClientId, createPrestation, deletePrestationById,
  getDocumentsByClientId, getDocumentById, createDocument, updateDocumentById,
  getRDVByUserId, createRDV, updateRDVById, deleteRDVById,
  getSalonSettings, upsertSalonSettings,
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
});

export type AppRouter = typeof appRouter;
