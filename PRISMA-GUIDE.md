# Prisma 설정 및 사용 가이드

이 문서는 TeamSync 애플리케이션의 Prisma 설정과 사용 방법에 대해 설명합니다.

## 환경 설정

1. 환경 변수 설정을 위해 프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```
# MongoDB 연결 문자열
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/teamsync?retryWrites=true&w=majority"

# NextAuth.js 관련 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-for-jwt

# Google OAuth 설정
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Prisma 초기화 및 마이그레이션

MongoDB를 사용하는 경우 명시적인 마이그레이션 없이 데이터베이스 스키마를 생성할 수 있습니다:

```bash
# Prisma 클라이언트 생성
npx prisma generate
```

## 기존 코드 수정

기존 DB 관련 파일을 수정하여 새로운 스키마와 모델을 사용하도록 업데이트합니다.

### src/lib/db.ts

기존 `db.ts` 파일은 그대로 사용하거나 다음과 같이 수정할 수 있습니다:

```typescript
import { PrismaClient } from '@prisma/client';

// PrismaClient 인스턴스를 global에 추가하기 위한 타입 확장
declare global {
  var prisma: PrismaClient | undefined;
}

// 개발 환경에서 핫 리로드 시 여러 PrismaClient 인스턴스 생성 방지
const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };
```

### src/lib/prisma.ts

`prisma.ts` 파일은 삭제하거나 `db.ts`와 통합할 수 있습니다. 중복된 Prisma 인스턴스 생성을 방지하기 위해 하나의 파일만 사용하는 것이 좋습니다.

## Prisma 사용 예시

### 사용자 생성

```typescript
import { prisma } from '@/lib/db';

async function createUser(userData) {
  const user = await prisma.user.create({
    data: userData,
  });
  return user;
}
```

### 프로젝트 및 태스크 가져오기

```typescript
import { prisma } from '@/lib/db';

async function getProjectWithTasks(projectId) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      tasks: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });
  return project;
}
```

### 관계 데이터 생성

```typescript
import { prisma } from '@/lib/db';

async function createTaskWithLabels(taskData, labelIds) {
  const task = await prisma.task.create({
    data: {
      ...taskData,
      labels: {
        create: labelIds.map((labelId) => ({
          label: {
            connect: { id: labelId },
          },
        })),
      },
    },
  });
  return task;
}
```

## 데이터베이스 시드 (초기 데이터 생성)

개발 및 테스트를 위해 초기 데이터를 생성하는 시드 스크립트를 작성할 수 있습니다. `prisma/seed.ts` 파일을 생성하여 다음과 같이 작성합니다:

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 관리자 사용자 생성
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      // 실제 구현에서는 비밀번호 해싱 필요
      password: 'password',
    },
  });

  // 일반 사용자 생성
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      role: 'user',
      // 실제 구현에서는 비밀번호 해싱 필요
      password: 'password',
    },
  });

  // 샘플 프로젝트 생성
  const project = await prisma.project.create({
    data: {
      name: '샘플 프로젝트',
      description: '개발 테스트를 위한 샘플 프로젝트입니다.',
      ownerId: admin.id,
      members: {
        create: [
          {
            role: 'owner',
            userId: admin.id,
          },
          {
            role: 'member',
            userId: user.id,
          },
        ],
      },
    },
  });

  // 샘플 태스크 생성
  await prisma.task.createMany({
    data: [
      {
        title: '프로젝트 설정',
        description: '프로젝트 초기 환경 설정 및 구조 잡기',
        status: 'done',
        priority: 'high',
        assigneeId: admin.id,
        projectId: project.id,
      },
      {
        title: '데이터베이스 설계',
        description: 'Prisma 스키마 설계 및 모델 정의',
        status: 'in_progress',
        priority: 'high',
        assigneeId: admin.id,
        projectId: project.id,
      },
      {
        title: '로그인 페이지 구현',
        description: '사용자 인증 페이지 UI 및 기능 구현',
        status: 'todo',
        priority: 'medium',
        assigneeId: user.id,
        projectId: project.id,
      },
    ],
  });

  console.log(`Seed 데이터 생성 완료`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

`package.json`에 시드 스크립트를 추가합니다:

```json
"scripts": {
  // 기존 스크립트들...
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

그리고 다음 명령으로 시드 데이터를 생성할 수 있습니다:

```bash
npx prisma db seed
```

## 데이터베이스 스튜디오

Prisma Studio를 사용하여 데이터베이스를 시각적으로 탐색하고 관리할 수 있습니다:

```bash
npx prisma studio
```

이 명령은 기본적으로 `http://localhost:5555`에서 Prisma Studio를 실행합니다.
