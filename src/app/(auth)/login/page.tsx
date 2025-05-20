import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CredentialsLoginForm } from './credentials-login-form';

export const metadata: Metadata = {
  title: '로그인 | TeamSync',
  description: 'TeamSync에 로그인하세요',
};

export default async function LoginPage() {
  // 이미 로그인 된 경우 대시보드로 리다이렉트
  const session = await auth();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">TeamSync</h1>
          <p className="text-sm text-muted-foreground">이메일을 입력하여 계정에 로그인하세요</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">로그인</CardTitle>
            <CardDescription>원하는 로그인 방식을 선택하세요</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <CredentialsLoginForm />
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-muted-foreground text-center mt-2">
              <span>계정이 없으신가요? </span>
              <Button variant="link" className="pl-1 underline hover:no-underline" asChild>
                <Link href="/register">회원가입</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
