# TeamSync

TeamSync는 Jira, Confluence, Notion과 유사한 협업 도구로, 팀의 일정 관리, 태스크 관리, 문서 작업 및 실시간 협업을 위한 올인원 솔루션입니다.

## 기술 스택

### 프론트엔드

- **프레임워크**: Next.js 15 (App Router)
- **스타일링**: Tailwind CSS 4
- **UI 라이브러리**: shadcn/ui
- **실시간 에디터**: TipTap + Yjs

### 백엔드

- **서버**: Next.js API Routes
- **데이터베이스**: MongoDB
- **ORM/ODM**: Prisma
- **인증**: NextAuth.js v5 (Auth.js) + 구글 로그인

### 실시간 기능

- **프로토콜**: WebSocket
- **데이터 동기화**: Yjs (CRDT 기반)

## 시작하기

### 필수 요구사항

- Node.js 18.18.0 이상
- pnpm 또는 yarn

### 설치

1. 레포지토리 복제:

```bash
git clone https://github.com/hannah3406/teamSync.git
cd teamSync
```

2. 패키지 설치 (pnpm 사용):

```bash
pnpm install
```

또는 yarn 사용:

```bash
yarn
```

3. 환경 변수 설정:
   `.env.example` 파일을 `.env.local`로 복사하고 필요한 값을 채웁니다.

4. 데이터베이스 설정:

```bash
pnpm prisma generate
pnpm prisma db push
```

5. 개발 서버 실행:

```bash
pnpm dev
```

이제 브라우저에서 [http://localhost:3000](http://localhost:3000)에 접속하여 애플리케이션을 확인할 수 있습니다.

## 문서

- [GUIDE.md](./GUIDE.md) - 자세한 설정 및 사용 가이드
- [SHADCN-UI-GUIDE.md](./SHADCN-UI-GUIDE.md) - shadcnUI 설정 및 사용 가이드

## 기능

- **인증**: 구글 로그인 통합
- **대시보드**: 작업 및 프로젝트 개요
- **태스크 관리**: 작업 생성, 할당 및 추적
- **프로젝트 관리**: 프로젝트 생성 및 관리
- **실시간 문서 편집**: 공동 작업 및 문서 관리
- **팀 관리**: 팀원 초대 및 권한 관리

## 라이센스

이 프로젝트는 MIT 라이센스에 따라 사용이 허가됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
