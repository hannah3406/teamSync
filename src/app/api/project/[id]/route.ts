import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// 프로젝트 조회 (GET)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const projectId = params.id;
    const userId = session.user.id;

    // 프로젝트 조회 (접근 권한 확인 포함)
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        team: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            documents: true,
            members: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// 프로젝트 수정 (PATCH)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const projectId = params.id;
    const userId = session.user.id;
    const body = await request.json();

    // 수정 가능한 필드들
    const { name, description, startDate, endDate, teamId } = body;

    // 프로젝트 접근 권한 확인 (owner 또는 admin만 수정 가능)
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: projectId,
        userId: userId,
        role: { in: ['owner', 'admin'] },
      },
    });

    if (!projectMember) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // 프로젝트 업데이트
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(teamId !== undefined && { teamId: teamId || null }),
      },
      include: {
        team: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            documents: true,
            members: true,
          },
        },
      },
    });

    // 활동 기록
    await prisma.userActivity.create({
      data: {
        action: 'updated',
        entityType: 'project',
        entityId: projectId,
        details: { projectName: updatedProject.name },
        userId,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// 프로젝트 삭제 (DELETE)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const projectId = params.id;
    const userId = session.user.id;

    // 프로젝트 소유자 확인
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId, // 소유자만 삭제 가능
      },
      include: {
        _count: {
          select: {
            tasks: true,
            documents: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or permission denied' }, { status: 404 });
    }

    // 관련 데이터가 있는지 확인
    if (project._count.tasks > 0) {
      return NextResponse.json(
        {
          error: '프로젝트에 태스크가 있어 삭제할 수 없습니다. 먼저 모든 태스크를 삭제해주세요.',
        },
        { status: 400 }
      );
    }

    if (project._count.documents > 0) {
      return NextResponse.json(
        {
          error: '프로젝트에 문서가 있어 삭제할 수 없습니다. 먼저 모든 문서를 삭제해주세요.',
        },
        { status: 400 }
      );
    }

    // 관련 데이터 삭제
    // 1. 프로젝트 멤버 삭제
    await prisma.projectMember.deleteMany({
      where: { projectId },
    });

    // 2. 라벨 삭제
    await prisma.label.deleteMany({
      where: { projectId },
    });

    // 3. 마일스톤 삭제
    await prisma.milestone.deleteMany({
      where: { projectId },
    });

    // 4. 알림 삭제
    await prisma.notification.deleteMany({
      where: {
        entityType: 'project',
        entityId: projectId,
      },
    });

    // 프로젝트 삭제
    await prisma.project.delete({
      where: { id: projectId },
    });

    // 삭제 활동 기록
    await prisma.userActivity.create({
      data: {
        action: 'deleted',
        entityType: 'project',
        entityId: projectId,
        details: { projectName: project.name },
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
