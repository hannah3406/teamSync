# Shadcn/UI 컴포넌트 설정 가이드

이 문서는 TeamSync 프로젝트에서 shadcn/ui 컴포넌트를 설정하는 방법을 안내합니다.

## 필요한 패키지

shadcn/ui 컴포넌트를 사용하기 위해 다음 패키지를 설치해야 합니다:

```bash
# 기본 패키지
pnpm add class-variance-authority clsx tailwind-merge lucide-react

# Radix UI 패키지
pnpm add @radix-ui/react-slot @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-avatar @radix-ui/react-tooltip @radix-ui/react-tabs @radix-ui/react-label @radix-ui/react-checkbox
```

## 컴포넌트 추가 방법

shadcn/ui 컴포넌트는 다음 두 가지 방법으로 추가할 수 있습니다:

### 1. CLI 사용 (권장)

shadcn/ui CLI 도구를 사용하여 컴포넌트를 쉽게 추가할 수 있습니다:

```bash
# shadcn/ui CLI 설치
pnpm add -D @shadcn/ui

# 컴포넌트 추가 예시
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dropdown-menu
```

### 2. 수동 추가

각 컴포넌트 파일을 직접 `src/components/ui` 디렉토리에 추가할 수도 있습니다. 현재 프로젝트에 이미 추가된 컴포넌트:

- Button (`src/components/ui/button.tsx`)
- Card (`src/components/ui/card.tsx`)
- Avatar (`src/components/ui/avatar.tsx`)
- DropdownMenu (`src/components/ui/dropdown-menu.tsx`)

## 유틸리티 함수

shadcn/ui 컴포넌트는 `cn` 유틸리티 함수를 사용합니다. 이 함수는 이미 `src/lib/utils.ts` 파일에 추가되어 있습니다:

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 추가 컴포넌트

더 많은 컴포넌트가 필요한 경우 CLI를 사용하여 추가하거나 [shadcn/ui 공식 문서](https://ui.shadcn.com/docs/components)에서 컴포넌트 코드를 확인할 수 있습니다.

```bash
# 자주 사용하는 컴포넌트 추가 예시
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
```

## 문제 해결

컴포넌트 사용 중 오류가 발생하면 다음을 확인하세요:

1. 필요한 Radix UI 패키지가 모두 설치되어 있는지 확인
2. `tailwind.config.ts` 파일에 shadcn/ui 테마 설정이 있는지 확인
3. `globals.css` 파일에 필요한 CSS 변수가 있는지 확인

더 자세한 내용은 [shadcn/ui 공식 문서](https://ui.shadcn.com)를 참고하세요.
