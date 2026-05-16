import type { CookieOptions, Request } from "express";
import { ONE_YEAR_MS } from "@shared/const";

function isSecureRequest(req: Request): boolean {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const forwardedProtocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  const normalizedForwardedProtocol = forwardedProtocol?.split(",")[0]?.trim().toLowerCase();

  return Boolean(req.secure || normalizedForwardedProtocol === "https");
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure" | "maxAge"> {
  const secure = isSecureRequest(req);
  return {
    httpOnly: true,
    path: "/",
    // Utilisation de SameSite=None pour garantir l'envoi des cookies lors des appels API tRPC
    // Nécessite l'attribut Secure=true
    sameSite: secure ? "none" : "lax",
    secure: secure,
    maxAge: ONE_YEAR_MS,
  };
}
