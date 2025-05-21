import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth'; // 현재 인증된 사용자 정보를 가져오기 위해 추가

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    // 사용자가 소유하거나 참여 중인 프로젝트만 조회
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId }, // 소유한 프로젝트
          {
            members: {
              some: {
                userId: userId,
              },
            },
          }, // 멤버로 참여 중인 프로젝트
        ],
      },
      include: {
        team: true,
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
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
    const { name, description, teamId } = body;

    if (!name) {
      return NextResponse.json({ error: '프로젝트 이름을 입력해주세요.' }, { status: 400 });
    }

    // 현재 인증된 사용자 정보를 가져옵니다
    const session = await auth();

    // 로그인하지 않은 경우 에러를 반환합니다
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    // 프로젝트 생성
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId,
        teamId: teamId || undefined,
        // 프로젝트 생성자를 멤버로 자동 추가
        members: {
          create: {
            userId: userId,
            role: 'owner',
          },
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
