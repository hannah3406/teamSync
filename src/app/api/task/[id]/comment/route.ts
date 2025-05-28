import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// 댓글 작성 (POST)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const taskId = params.id;
    const userId = session.user.id;
    const body = await request.json();
    const { content } = body;

    // 내용 검증
    if (!content || !content.trim()) {
      return NextResponse.json({ error: '댓글 내용을 입력해주세요.' }, { status: 400 });
    }

    // 태스크 존재 여부 및 권한 확인
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      },
      include: {
        assignee: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
    }

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        taskId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // 활동 기록 생성
    await prisma.userActivity.create({
      data: {
        action: 'commented',
        entityType: 'task',
        entityId: taskId,
        details: {
          taskTitle: task.title,
          commentId: comment.id,
          projectId: task.projectId,
        },
        userId,
      },
    });

    // 알림 생성
    const notificationTargets = new Set<string>();

    // 1. 태스크 담당자에게 알림 (본인이 아닌 경우)
    if (task.assigneeId && task.assigneeId !== userId) {
      notificationTargets.add(task.assigneeId);
    }

    // 2. 이전 댓글 작성자들에게 알림 (중복 제거, 본인 제외)
    const previousCommenters = await prisma.comment.findMany({
      where: {
        taskId,
        authorId: {
          not: userId,
        },
      },
      select: {
        authorId: true,
      },
      distinct: ['authorId'],
    });

    previousCommenters.forEach((commenter) => {
      notificationTargets.add(commenter.authorId);
    });

    // 알림 생성
    if (notificationTargets.size > 0) {
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });

      await prisma.notification.createMany({
        data: Array.from(notificationTargets).map((targetUserId) => ({
          type: 'comment',
          message: `${currentUser?.name || currentUser?.email}님이 태스크 "${task.title}"에 댓글을 남겼습니다.`,
          entityType: 'task',
          entityId: taskId,
          userId: targetUserId,
        })),
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

// 댓글 목록 조회 (GET)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const taskId = params.id;
    const userId = session.user.id;

    // 태스크 접근 권한 확인
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
    }

    // 댓글 목록 조회
    const comments = await prisma.comment.findMany({
      where: {
        taskId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
