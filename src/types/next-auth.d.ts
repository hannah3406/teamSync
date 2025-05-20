// types/next-auth.d.ts
import { DefaultSession } from 'next-auth';

// 기본 User 타입 확장
declare module 'next-auth' {
  interface User {
    id: string;
    role?: string;
    // 기타 필요한 사용자 필드
  }

  // 세션 타입 확장
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }
}

// JWT 타입 확장
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
    // 기타 필요한 JWT 필드
  }
}
