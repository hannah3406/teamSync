// src/app/api/comment/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// 댓글 삭제 (DELETE)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const commentId = params.id;
    const userId = session.user.id;

    // 댓글 조회 (작성자 확인 및 권한 체크)
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        task: {
          include: {
            project: {
              include: {
                members: {
                  where: {
                    userId: userId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // 프로젝트 멤버인지 확인
    if (comment.task?.project.members.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // 작성자 본인만 삭제 가능
    if (comment.authorId !== userId) {
      return NextResponse.json({ error: 'Only comment author can delete' }, { status: 403 });
    }

    // 관련 알림 삭제
    try {
      // 댓글과 관련된 모든 알림을 삭제 (간단한 방식)
      await prisma.notification.deleteMany({
        where: {
          entityType: 'task',
          entityId: comment.taskId,
          // 댓글 관련 알림은 보통 'comment' 타입
          type: 'comment',
        },
      });
    } catch (notificationError) {
      console.error('Error deleting notifications:', notificationError);
      // 알림 삭제 실패는 무시하고 계속 진행
    }

    // 댓글 삭제
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({
      success: true,
      taskId: comment.taskId,
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
