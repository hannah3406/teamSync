'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

export function CredentialsLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDevLogin, setShowDevLogin] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 이메일과 비밀번호가 문자열인지 확인
      if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
        setError('유효한 이메일과 비밀번호를 입력해주세요.');
        setIsLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다. 다시 시도해주세요.');
      } else if (result?.ok) {
        // 성공적으로 로그인되면 대시보드로 리다이렉트
        router.push('/dashboard');
        router.refresh(); // 세션이 업데이트되었으니 클라이언트 라우터를 새로고침
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // callbackUrl 파라미터를 명시적으로 지정
      await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true,
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('구글 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      {/* Google 로그인 버튼 (주 로그인 방식) */}
      <Button
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 py-5"
      >
        {isLoading ? (
          <span className="animate-spin">...</span>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
              fill="#EA4335"
            />
          </svg>
        )}
        <span>구글로 로그인</span>
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">또는</span>
        </div>
      </div>

      {/* 개발용 로그인 토글 버튼 */}
      <Button
        variant="ghost"
        type="button"
        className="text-xs text-muted-foreground"
        onClick={() => setShowDevLogin(!showDevLogin)}
      >
        {showDevLogin ? '개발용 로그인 숨기기' : '개발용 로그인 사용하기'}
      </Button>

      {/* 개발용 로그인 폼 */}
      {showDevLogin && (
        <form onSubmit={handleSubmit} className="space-y-4 border rounded-md p-4 bg-muted/20">
          <div className="text-xs font-semibold text-muted-foreground mb-2">개발용 로그인</div>
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="flex items-center text-sm text-destructive gap-1 mt-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>

          <div className="text-xs text-muted-foreground mt-2">
            <p>
              <strong>테스트 계정:</strong>
            </p>
            <p>- 관리자: admin@example.com / password</p>
            <p>- 사용자: user@example.com / password</p>
          </div>
        </form>
      )}
    </div>
  );
}
