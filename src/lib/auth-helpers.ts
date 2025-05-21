// src/lib/auth-helpers.ts
import * as crypto from 'crypto';
import { type User } from '@prisma/client';

/**
 * 비밀번호를 해싱합니다.
 * 실제 프로덕션 환경에서는 bcrypt 등의 더 안전한 방식 사용 권장
 */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * 비밀번호가 유효한지 확인합니다.
 */
export function verifyPassword(user: User, inputPassword: string): boolean {
  if (!user.password) return false;
  const inputHash = hashPassword(inputPassword);

  // 해시 길이가 다르면 일치하지 않음
  if (inputHash.length !== user.password.length) return false;

  try {
    return crypto.timingSafeEqual(Buffer.from(inputHash, 'utf8'), Buffer.from(user.password, 'utf8'));
  } catch (error) {
    console.error('비밀번호 확인 중 오류:', error);
    return false;
  }
}

/**
 * 사용자에게 특정 리소스에 대한 접근 권한이 있는지 확인합니다.
 */
export function hasResourceAccess(user: User, resourceOwnerId: string, userRole: string = 'user'): boolean {
  // 관리자는 모든 리소스에 접근 가능
  if (user.role === 'admin') return true;

  // 본인이 소유한 리소스에 접근 가능
  if (user.id === resourceOwnerId) return true;

  // 특정 역할을 가진 사용자에게만 접근 허용
  // 예: 'editor' 역할이 필요한 리소스에 'user' 역할만 있으면 접근 불가
  if (userRole !== 'user' && user.role !== userRole) return false;

  return false;
}

/**
 * 사용자 객체에서 민감한 정보를 제외하고 반환합니다.
 */
export function sanitizeUser(user: User): Omit<User, 'password'> {
  // password 필드를 제외한 사용자 정보 반환
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

/**
 * 이메일이 유효한 형식인지 확인합니다.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호가 정책을 만족하는지 확인합니다.
 * 최소 8자, 최소 하나의 숫자, 최소 하나의 대문자, 최소 하나의 특수문자 포함
 */
export function isStrongPassword(password: string): boolean {
  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return minLength && hasNumber && hasUpperCase && hasSpecialChar;
}

/**
 * 이메일 확인 토큰을 생성합니다.
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * 비밀번호 재설정 토큰을 생성합니다.
 */
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
