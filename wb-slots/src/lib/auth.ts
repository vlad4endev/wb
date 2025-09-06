import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { User } from '@prisma/client';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export function verifyToken(token: string): JWTPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AuthError('JWT_SECRET is not configured', 500);
  }

  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    throw new AuthError('Invalid or expired token', 401);
  }
}

export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  try {
    const token = extractTokenFromRequest(request);
    if (!token) return null;

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export function extractTokenFromRequest(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try cookie
  const token = request.cookies.get('auth-token')?.value;
  return token || null;
}

export async function requireAuth(request: NextRequest): Promise<User> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new AuthError('Authentication required', 401);
  }
  return user;
}

export async function requireAdmin(request: NextRequest): Promise<User> {
  const user = await requireAuth(request);
  if (user.role !== 'ADMIN') {
    throw new AuthError('Admin access required', 403);
  }
  return user;
}

export function setAuthCookie(response: Response, token: string): void {
  response.headers.set(
    'Set-Cookie',
    `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`
  );
}

export function clearAuthCookie(response: Response): void {
  response.headers.set(
    'Set-Cookie',
    'auth-token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
  );
}
