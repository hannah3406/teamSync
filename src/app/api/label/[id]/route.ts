import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// 사전 정의된 라벨 색상 (동일한 목록 유지)
const PRESET_COLORS = [
  '#e74c3c',
  '#e67e22',
  '#f39c12',
  '#2ecc71',
  '#1abc9c',
  '#3498db',
  '#9b59b6',
  '#34495e',
  '#95a5a6',
  '#d35400',
  '#c0392b',
  '#16a085',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
];

// 라벨 수정 (PATCH)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const labelId = params.id;
    const userId = session.user.id;
    const body = await request.json();
    const { name, color } = body;

    // 라벨 조회 및 권한 확인
    const label = await prisma.label.findUnique({
      where: { id: labelId },
      include: {
        project: {
          include: {
            members: {
              where: {
                userId,
                role: { in: ['owner', 'admin'] },
              },
            },
          },
        },
      },
    });

    if (!label) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 });
    }

    if (label.project.members.length === 0) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // 업데이트할 데이터 준비
    const updateData: {
      name?: string;
      color?: string;
    } = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json({ error: '라벨 이름을 입력해주세요.' }, { status: 400 });
      }

      // 같은 프로젝트 내 중복 이름 확인 (자기 자신 제외)
      const existingLabel = await prisma.label.findFirst({
        where: {
          projectId: label.projectId,
          name: name.trim(),
          id: { not: labelId },
        },
      });

      if (existingLabel) {
        return NextResponse.json({ error: '이미 같은 이름의 라벨이 존재합니다.' }, { status: 409 });
      }

      updateData.name = name.trim();
    }

    if (color !== undefined) {
      if (!PRESET_COLORS.includes(color)) {
        return NextResponse.json({ error: '유효하지 않은 색상입니다.' }, { status: 400 });
      }
      updateData.color = color;
    }

    // 라벨 업데이트
    const updatedLabel = await prisma.label.update({
      where: { id: labelId },
      data: updateData,
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
        action: 'updated',
        entityType: 'label',
        entityId: labelId,
        details: {
          labelName: updatedLabel.name,
          projectId: label.projectId,
          changes: updateData,
        },
        userId,
      },
    });

    return NextResponse.json(updatedLabel);
  } catch (error) {
    console.error('Error updating label:', error);
    return NextResponse.json({ error: 'Failed to update label' }, { status: 500 });
  }
}

// 라벨 삭제 (DELETE)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const labelId = params.id;
    const userId = session.user.id;

    // 라벨 조회 및 권한 확인
    const label = await prisma.label.findUnique({
      where: { id: labelId },
      include: {
        project: {
          include: {
            members: {
              where: {
                userId,
                role: { in: ['owner', 'admin'] },
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    if (!label) {
      return NextResponse.json({ error: 'Label not found' }, { status: 404 });
    }

    if (label.project.members.length === 0) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // 사용 중인 라벨인지 확인
    if (label._count.tasks > 0) {
      return NextResponse.json(
        {
          error: `이 라벨은 ${label._count.tasks}개의 태스크에서 사용 중입니다. 먼저 태스크에서 라벨을 제거해주세요.`,
        },
        { status: 400 }
      );
    }

    // 라벨 삭제
    await prisma.label.delete({
      where: { id: labelId },
    });

    // 활동 기록
    await prisma.userActivity.create({
      data: {
        action: 'deleted',
        entityType: 'label',
        entityId: labelId,
        details: {
          labelName: label.name,
          projectId: label.projectId,
        },
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting label:', error);
    return NextResponse.json({ error: 'Failed to delete label' }, { status: 500 });
  }
}
