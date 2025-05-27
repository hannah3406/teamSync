import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    // 필터링 옵션
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const assigneeId = searchParams.get('assigneeId');
    const priority = searchParams.get('priority');

    // 정렬 옵션
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // 페이지네이션 옵션
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // 필터 조건 구성
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      OR: [
        { assigneeId: userId }, // 사용자에게 할당된 태스크
        {
          project: {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        }, // 사용자가 속한 프로젝트의 태스크
      ],
    };

    // 추가 필터 조건 적용
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId === 'me' ? userId : assigneeId;
    if (priority) where.priority = priority;

    // 정렬 조건 구성
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // 전체 개수 조회
    const totalCount = await prisma.task.count({ where });

    // 태스크 조회 (페이지네이션 적용)
    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { title, description, projectId, status, priority, assigneeId, labelIds, dueDate } = body;

    // 필수 필드 검증
    if (!title) {
      return NextResponse.json({ error: '태스크 제목을 입력해주세요.' }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json({ error: '프로젝트를 선택해주세요.' }, { status: 400 });
    }

    // 프로젝트 접근 권한 확인
    const projectMembership = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    if (!projectMembership) {
      return NextResponse.json({ error: '해당 프로젝트에 태스크를 생성할 권한이 없습니다.' }, { status: 403 });
    }

    // 현재 프로젝트의 최대 position 값 조회
    const maxPositionTask = await prisma.task.findFirst({
      where: { projectId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const newPosition = maxPositionTask ? maxPositionTask.position + 1 : 0;

    // 태스크 생성
    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: status || 'todo',
        priority: priority || 'medium',
        projectId,
        assigneeId: assigneeId || userId, // 기본적으로 생성자에게 할당
        position: newPosition,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        // 라벨 연결 (존재하는 경우)
        ...(labelIds && labelIds.length > 0
          ? {
              labels: {
                create: labelIds.map((labelId: string) => ({
                  labelId,
                })),
              },
            }
          : {}),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
      },
    });

    // 사용자 활동 기록
    await prisma.userActivity.create({
      data: {
        action: 'created',
        entityType: 'task',
        entityId: task.id,
        details: { taskTitle: task.title, projectId: task.projectId },
        userId,
      },
    });

    // 담당자에게 알림 생성 (본인이 아닌 경우)
    if (assigneeId && assigneeId !== userId) {
      await prisma.notification.create({
        data: {
          type: 'assignment',
          message: `새로운 태스크 "${task.title}"이 할당되었습니다.`,
          entityType: 'task',
          entityId: task.id,
          userId: assigneeId,
        },
      });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
