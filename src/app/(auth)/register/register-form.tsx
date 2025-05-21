'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 비밀번호 강도 체크 함수
  const checkPasswordStrength = (pass: string): 'weak' | 'medium' | 'strong' => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    const passLength = pass.length;

    if (passLength < 8) return 'weak';
    if (passLength >= 8 && ((hasUpperCase && hasLowerCase) || hasNumbers || hasSpecialChars)) return 'medium';
    if (passLength >= 10 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) return 'strong';

    return 'medium';
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pass = e.target.value;
    setPassword(pass);
    if (pass.length > 0) {
      setPasswordStrength(checkPasswordStrength(pass));
    } else {
      setPasswordStrength(null);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // 기본 유효성 검사
    if (!name || !email || !password || !confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    if (passwordStrength === 'weak') {
      setError('더 강력한 비밀번호를 사용해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      // API를 통한 회원가입 요청
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '회원가입 중 오류가 발생했습니다.');
      }

      // 회원가입 성공
      setSuccessMessage('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');

      // 3초 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          placeholder="홍길동"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

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
          disabled={isLoading}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          placeholder="••••••••"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={handlePasswordChange}
          disabled={isLoading}
          required
        />
        {passwordStrength && (
          <div className="flex items-center text-sm gap-1 mt-1">
            <div
              className={`h-1 flex-1 rounded-full ${
                passwordStrength === 'weak'
                  ? 'bg-destructive'
                  : passwordStrength === 'medium'
                  ? 'bg-amber-500'
                  : 'bg-green-500'
              }`}
            />
            <span
              className={`ml-2 ${
                passwordStrength === 'weak'
                  ? 'text-destructive'
                  : passwordStrength === 'medium'
                  ? 'text-amber-500'
                  : 'text-green-500'
              }`}
            >
              {passwordStrength === 'weak' ? '약함' : passwordStrength === 'medium' ? '중간' : '강함'}
            </span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          <Info className="inline mr-1 h-3 w-3" />
          8자 이상, 대소문자, 숫자, 특수문자를 포함하면 더 안전합니다.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          placeholder="••••••••"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      {error && (
        <div className="flex items-center text-sm text-destructive gap-1 mt-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center text-sm text-green-500 gap-1 mt-2">
          <CheckCircle className="h-4 w-4" />
          <span>{successMessage}</span>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? '계정 생성 중...' : '계정 생성하기'}
      </Button>
    </form>
  );
}
