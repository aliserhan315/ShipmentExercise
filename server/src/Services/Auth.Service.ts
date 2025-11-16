import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Session from "../models/Session";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const ACCESS_TOKEN_TTL = "15m";     
const REFRESH_TOKEN_DAYS = 7;       
function signAccessToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

async function createRefreshToken(userId: number): Promise<string> {
  const refreshToken = cryptoRandomString(64);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

  await Session.create({
    userId,
    refreshToken,
    expiresAt,
  });

  return refreshToken;
}

function cryptoRandomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function toSafeUser(user: User) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    location: user.location,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const AuthService = {
  async register(input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    location?: string;
  }) {
    const emailLc = input.email.trim().toLowerCase();
    const existing = await User.findOne({ where: { email: emailLc } });
    if (existing) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await User.create({
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: emailLc,
      password: hashedPassword,
      phone: input.phone.trim(),
      location: input.location?.trim() ?? undefined,
    });

    const accessToken = signAccessToken(user);
    const refreshToken = await createRefreshToken(user.id);

    return {
      user: toSafeUser(user),
      accessToken,
      refreshToken,
    };
  },

  async login(input: { email: string; password: string }) {
    const emailLc = input.email.trim().toLowerCase();
    const user = await User.findOne({ where: { email: emailLc } });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) {
      throw new Error("Invalid credentials");
    }

    const accessToken = signAccessToken(user);
    const refreshToken = await createRefreshToken(user.id);

    return {
      user: toSafeUser(user),
      accessToken,
      refreshToken,
    };
  },

  async refresh(input: { refreshToken: string }) {
    const token = String(input.refreshToken || "").trim();
    if (!token) {
      throw new Error("Invalid refresh token");
    }

    const session = await Session.findOne({ where: { refreshToken: token } });
    if (!session || session.expiresAt < new Date()) {
      throw new Error("Invalid refresh token");
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      throw new Error("Invalid refresh token");
    }

    const accessToken = signAccessToken(user);
    return {
      user: toSafeUser(user),
      accessToken,
      refreshToken: token,
    };
  },

  async logout(input: { refreshToken: string }) {
    const token = String(input.refreshToken || "").trim();
    if (!token) return;

    await Session.destroy({ where: { refreshToken: token } });
  },
};
