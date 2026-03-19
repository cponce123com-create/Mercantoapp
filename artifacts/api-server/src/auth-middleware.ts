import { Request, Response, NextFunction } from "express";
import { auth } from "./auth";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = await auth.api.getSession({
    headers: req.headers as any,
  });

  if (!session) {
    return res.status(401).json({ error: "No autorizado" });
  }

  req.user = session.user;
  req.session = session.session;
  next();
}

export async function requireRole(role: "buyer" | "seller" | "admin") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return res.status(401).json({ error: "No autorizado" });
    }

    if (session.user.role !== role && session.user.role !== "admin") {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    req.user = session.user;
    next();
  };
}
