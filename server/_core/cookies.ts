import type { CookieOptions, Request } from "express";
import { ONE_YEAR_MS } from "@shared/const";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");
  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure" | "maxAge"> {
  return {
    domain: ".intemporelle.eu",
    httpOnly: true,
    path: "/",
    // iPad/Safari (PWA) nécessite souvent SameSite=None + Secure pour persister.
    // On utilise Lax par défaut mais on s'assure que Secure est activé si possible.
    sameSite: "lax",
    secure: true, // Forcer Secure pour iPad
    maxAge: ONE_YEAR_MS,
  };
}
