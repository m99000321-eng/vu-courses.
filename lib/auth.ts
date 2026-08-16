import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'vu-courses-super-secret-key-2026'

export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: string
}

export interface RememberedAccountPayload extends JWTPayload {
  passwordHash: string
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function signRememberedAccountToken(payload: RememberedAccountPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '365d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export function verifyRememberedAccountToken(token: string): RememberedAccountPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as RememberedAccountPayload
  } catch {
    return null
  }
}

export function getAuthUser(req: NextRequest): JWTPayload | null {
  const token = req.cookies.get('vu_auth_token')?.value || req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  return verifyToken(token)
}

export function getRememberedAccount(req: NextRequest): RememberedAccountPayload | null {
  const token = req.cookies.get('vu_account_record')?.value
  if (!token) return null
  return verifyRememberedAccountToken(token)
}
