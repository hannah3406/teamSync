# TeamSync 프로젝트 실행 가이드

이 문서는 TeamSync 프로젝트를 설정하고 실행하는 방법을 안내합니다.

## 환경 설정

1. `.env.local` 파일을 프로젝트 루트에 생성하고 다음 환경 변수를 설정합니다:

```
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# MongoDB
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/teamsync?retryWrites=true&w=majority
```

2. Google OAuth 설정:

   - [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트를 생성합니다.
   - OAuth 동의 화면을 설정합니다.
   - OAuth 클라이언트 ID를 생성하고 리디렉션 URI를 `http://localhost:3000/api/auth/callback/google`로 설정합니다.
   - 생성된 클라이언트 ID와 비밀키를 `.env.local` 파일에 추가합니다.

3. MongoDB 설정:
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)에서 새 클러스터를 생성합니다.
   - 데이터베이스 사용자를 만들고 연결 문자열을 복사합니다.
   - 연결 문자열을 `.env.local` 파일의 `DATABASE_URL`에 붙여넣습니다.

## 프로젝트 설정

1. 필요한 패키지를 설치합니다:

```bash
npm install
```

2. Prisma 스키마를 데이터베이스에 적용합니다:

```bash
npx prisma generate
npx prisma db push
```

3. 개발 서버를 실행합니다:

```bash
npm run dev
```

4. 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인합니다.

## 프로젝트 구조

```
teamSync/
├── src/                   # 애플리케이션 소스 코드
│   ├── app/               # App Router 라우트 및 레이아웃
│   │   ├── (auth)/        # 인증 관련 라우트
│   │   ├── (dashboard)/   # 대시보드 관련 라우트
│   │   ├── api/           # API 엔드포인트
│   │   ├── layout.tsx     # 루트 레이아웃
│   │   └── page.tsx       # 홈 페이지
│   ├── components/        # 공유 컴포넌트
│   │   ├── ui/            # shadcn/ui 컴포넌트
│   │   ├── layout/        # 레이아웃 컴포넌트
│   │   └── dashboard/     # 대시보드 관련 컴포넌트
│   ├── lib/               # 라이브러리 코드, 유틸리티
│   └── types/             # TypeScript 타입 정의
├── prisma/                # Prisma 스키마 및 마이그레이션
│   └── schema.prisma      # 데이터베이스 스키마
├── public/                # 정적 자산
└── ...                    # 기타 설정 파일
```

## 다음 단계

1. TipTap 에디터와 Yjs 통합을 위한 실시간 문서 편집 기능 구현
2. 팀 및 프로젝트 관리 기능 개선
3. 태스크 관리 시스템 구현

프로젝트의 더 자세한 내용은 원래 프로젝트 기록 문서를 참조하세요.
