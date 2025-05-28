import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// 태스크 조회 (GET)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const taskId = params.id;
    const userId = session.user.id;

    // 태스크 조회 (접근 권한 확인 포함)
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
        milestone: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// 태스크 수정 (PATCH)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const taskId = params.id;
    const userId = session.user.id;
    const body = await request.json();

    // 수정 가능한 필드들
    const { title, description, status, priority, assigneeId, dueDate, milestoneId, labelIds } = body;

    // 태스크 접근 권한 확인
    const existingTask = await prisma.task.findFirst({
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
        labels: true,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found or access denied' }, { status: 404 });
    }

    // 라벨 업데이트 준비 (있는 경우)
    let labelUpdate = {};
    if (labelIds !== undefined) {
      // 기존 라벨 모두 삭제
      await prisma.taskLabel.deleteMany({
        where: { taskId },
      });

      // 새 라벨 연결
      if (labelIds.length > 0) {
        labelUpdate = {
          labels: {
            create: labelIds.map((labelId: string) => ({
              labelId,
            })),
          },
        };
      }
    }

    // 태스크 업데이트
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(assigneeId !== undefined && { assigneeId: assigneeId || null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(milestoneId !== undefined && { milestoneId: milestoneId || null }),
        ...labelUpdate,
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

    // 상태 변경 시 활동 기록
    if (status && status !== existingTask.status) {
      await prisma.userActivity.create({
        data: {
          action: 'updated',
          entityType: 'task',
          entityId: taskId,
          details: {
            taskTitle: updatedTask.title,
            status: status,
            previousStatus: existingTask.status,
          },
          userId,
        },
      });
    }

    // 담당자 변경 시 알림 생성
    if (assigneeId && assigneeId !== existingTask.assigneeId && assigneeId !== userId) {
      await prisma.notification.create({
        data: {
          type: 'assignment',
          message: `새로운 태스크 "${updatedTask.title}"이 할당되었습니다.`,
          entityType: 'task',
          entityId: taskId,
          userId: assigneeId,
        },
      });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// 태스크 삭제 (DELETE)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
              role: { in: ['owner', 'admin'] }, // 소유자나 관리자만 삭제 가능
            },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found or permission denied' }, { status: 404 });
    }

    // 관련 데이터 삭제 (Cascade가 설정되어 있지 않은 경우)
    // 1. 태스크 라벨 삭제
    await prisma.taskLabel.deleteMany({
      where: { taskId },
    });

    // 2. 댓글 삭제
    await prisma.comment.deleteMany({
      where: { taskId },
    });

    // 3. 알림 삭제
    await prisma.notification.deleteMany({
      where: {
        entityType: 'task',
        entityId: taskId,
      },
    });

    // 4. 활동 기록은 남겨둠 (히스토리 추적용)

    // 태스크 삭제
    await prisma.task.delete({
      where: { id: taskId },
    });

    // 삭제 활동 기록
    await prisma.userActivity.create({
      data: {
        action: 'deleted',
        entityType: 'task',
        entityId: taskId,
        details: { taskTitle: task.title, projectId: task.projectId },
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
