import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from './register-form';

export const metadata: Metadata = {
  title: '회원가입 | TeamSync',
  description: 'TeamSync에 회원가입하세요',
};

export default async function RegisterPage() {
  // 이미 로그인 된 경우 대시보드로 리다이렉트
  const session = await auth();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">TeamSync</h1>
          <p className="text-sm text-muted-foreground">새 계정을 만들고 TeamSync를 시작하세요</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">회원가입</CardTitle>
            <CardDescription>필수 정보를 입력하여 계정을 생성하세요</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <RegisterForm />
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-muted-foreground text-center mt-2">
              <span>이미 계정이 있으신가요? </span>
              <Button variant="link" className="pl-1 underline hover:no-underline" asChild>
                <Link href="/login">로그인</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
