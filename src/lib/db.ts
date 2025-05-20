import { PrismaClient } from '@prisma/client';

// PrismaClient 인스턴스를 global에 추가하기 위한 타입 확장
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 개발 환경에서 핫 리로드 시 여러 PrismaClient 인스턴스 생성 방지
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };
