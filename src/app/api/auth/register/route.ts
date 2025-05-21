import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, isValidEmail, isStrongPassword } from '@/lib/auth-helpers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 유효성 검사
    if (!name || !email || !password) {
      return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: '유효한 이메일을 입력해주세요.' }, { status: 400 });
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json({ error: '더 강력한 비밀번호를 사용해주세요.' }, { status: 400 });
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: '이미 사용 중인 이메일입니다.' }, { status: 409 });
    }

    // 비밀번호 해싱
    const hashedPassword = hashPassword(password);

    // 새 사용자 생성
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user', // 기본 역할 설정
      },
    });

    // 비밀번호 필드 제외한 사용자 정보 반환
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: '사용자 등록 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
