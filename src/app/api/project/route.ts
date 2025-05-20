import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth'; // 현재 인증된 사용자 정보를 가져오기 위해 추가

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: true,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    // 현재 인증된 사용자 정보를 가져옵니다
    const session = await auth();

    // 로그인하지 않은 경우 에러를 반환합니다
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    // Project 생성 시 workspaceId 대신 ownerId 필드를 사용합니다
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId, // workspaceId 대신 ownerId를 사용
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
