import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// 사전 정의된 라벨 색상
const PRESET_COLORS = [
  '#e74c3c', // 빨간색
  '#e67e22', // 주황색
  '#f39c12', // 노란색
  '#2ecc71', // 녹색
  '#1abc9c', // 청록색
  '#3498db', // 파란색
  '#9b59b6', // 보라색
  '#34495e', // 회색
  '#95a5a6', // 연한 회색
  '#d35400', // 진한 주황
  '#c0392b', // 진한 빨강
  '#16a085', // 진한 청록
  '#27ae60', // 진한 녹색
  '#2980b9', // 진한 파랑
  '#8e44ad', // 진한 보라
];

// 라벨 목록 조회 (GET)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const projectId = params.id;
    const userId = session.user.id;

    // 프로젝트 접근 권한 확인
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    if (!projectMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // 라벨 목록 조회
    const labels = await prisma.label.findMany({
      where: {
        projectId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(labels);
  } catch (error) {
    console.error('Error fetching labels:', error);
    return NextResponse.json({ error: 'Failed to fetch labels' }, { status: 500 });
  }
}

// 새 라벨 생성 (POST)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const projectId = params.id;
    const userId = session.user.id;
    const body = await request.json();
    const { name, color } = body;

    // 필수 필드 검증
    if (!name || !name.trim()) {
      return NextResponse.json({ error: '라벨 이름을 입력해주세요.' }, { status: 400 });
    }

    if (!color) {
      return NextResponse.json({ error: '라벨 색상을 선택해주세요.' }, { status: 400 });
    }

    // 색상이 preset에 포함되어 있는지 확인
    if (!PRESET_COLORS.includes(color)) {
      return NextResponse.json({ error: '유효하지 않은 색상입니다.' }, { status: 400 });
    }

    // 프로젝트 접근 권한 확인 (owner 또는 admin만 생성 가능)
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
        role: { in: ['owner', 'admin'] },
      },
    });

    if (!projectMember) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // 같은 프로젝트 내 중복 이름 확인
    const existingLabel = await prisma.label.findFirst({
      where: {
        projectId,
        name: name.trim(),
      },
    });

    if (existingLabel) {
      return NextResponse.json({ error: '이미 같은 이름의 라벨이 존재합니다.' }, { status: 409 });
    }

    // 라벨 생성
    const label = await prisma.label.create({
      data: {
        name: name.trim(),
        color,
        projectId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    // 활동 기록
    await prisma.userActivity.create({
      data: {
        action: 'created',
        entityType: 'label',
        entityId: label.id,
        details: {
          labelName: label.name,
          projectId,
        },
        userId,
      },
    });

    return NextResponse.json(label, { status: 201 });
  } catch (error) {
    console.error('Error creating label:', error);
    return NextResponse.json({ error: 'Failed to create label' }, { status: 500 });
  }
}

// preset 색상 목록을 반환하는 별도 엔드포인트
export async function OPTIONS() {
  return NextResponse.json({ colors: PRESET_COLORS });
}
