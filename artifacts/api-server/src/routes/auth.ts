import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "mercanto-secret-key";

// Usuarios hardcodeados temporalmente
const USERS = [
  {
    id: 1,
    email: "mercantoapp@gmail.com",
    password: bcrypt.hashSync("Hadrones456%", 10),
    name: "Admin Mercanto",
    role: "admin" as const,
  },
];

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = USERS.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  try {
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = USERS.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
});

// POST /api/auth/logout
router.post("/logout", (_req, res) => {
  res.clearCookie("auth_token");
  return res.json({ ok: true });
});

export default router;
