// src/lib/auth.ts 수정
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { verifyPassword } from './auth-helpers';

// 클라이언트 측에서 사용할 수 있도록 signOut 함수를 내보냅니다
export { signOut } from 'next-auth/react';

// Prisma 클라이언트를 생성합니다
// 참고: Next.js 개발 환경에서는 hot reloading으로 인해 여러 Prisma 인스턴스가 생성될 수 있습니다
// 이를 방지하기 위한 싱글턴 패턴 적용
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'], // 디버깅을 위한 로그 활성화
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// NextAuth 설정 - 타입 오류 해결을 위해 authorize 함수 분리
const credentialsProvider = CredentialsProvider({
  name: 'Credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  authorize: async (credentials) => {
    // credentials가 null이거나 정의되지 않은 경우 처리
    if (!credentials) return null;

    // email 또는 password가 없는 경우 처리
    if (!credentials.email || !credentials.password) return null;

    try {
      // email이 문자열인지 확인 후 타입 단언
      const email = typeof credentials.email === 'string' ? credentials.email : '';

      // 실제 데이터베이스에서 사용자 확인
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user && verifyPassword(user, credentials.password as string)) {
        // 실제 사용자가 있고 비밀번호가 일치하는 경우
        return {
          id: user.id,
          name: user.name || undefined,
          email: user.email || undefined,
          image: user.image || undefined,
          role: user.role || 'user',
        };
      }

      // 개발용 테스트 계정 - 실제 사용자가 없을 때만 사용
      if (
        (credentials.email === 'admin@example.com' && credentials.password === 'password') ||
        (credentials.email === 'user@example.com' && credentials.password === 'password')
      ) {
        // 개발용 계정도 실제 데이터베이스의 사용자를 찾아서 사용
        const testUser = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (testUser) {
          return {
            id: testUser.id,
            name: testUser.name || undefined,
            email: testUser.email || undefined,
            image: testUser.image || undefined,
            role: testUser.role || 'user',
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Auth error:', error);
      return null;
    }
  },
});

// NextAuth 설정
export const {
  handlers: { GET, POST },
  auth,
  signIn: serverSignIn,
  signOut: serverSignOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    credentialsProvider,
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // user 객체에서 role 속성 가져오기
        // role이 있을 경우에만 token에 추가
        if ('role' in user) {
          token.role = user.role as string;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // token에 role 속성이 있을 경우에만 session.user에 추가
        if ('role' in token) {
          session.user.role = token.role as string;
        }
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production', // 개발 모드에서 디버깅 활성화
});
