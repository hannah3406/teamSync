import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';

// 에러 응답 타입
interface ErrorResponse {
  error: string;
}

// 알림 타입 정의
type NotificationType = 'mention' | 'comment' | 'assignment' | 'project_update' | 'task_update';

// 전체 읽음 처리 요청 타입
interface MarkAllAsReadRequest {
  type?: NotificationType;
}

// 전체 읽음 처리 응답 타입
interface MarkAllAsReadResponse {
  success: boolean;
  updatedCount: number;
  unreadCount: number;
}

export async function PATCH(request: NextRequest): Promise<NextResponse<MarkAllAsReadResponse | ErrorResponse>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;
    const body: MarkAllAsReadRequest = await request.json();
    const { type } = body;

    // 업데이트 조건
    const where: Prisma.NotificationWhereInput = {
      userId: userId,
      isRead: false,
      ...(type && { type }),
    };

    // 모든 읽지 않은 알림을 읽음으로 처리
    const result = await prisma.notification.updateMany({
      where,
      data: {
        isRead: true,
      },
    });

    // 업데이트된 읽지 않은 개수 조회
    const unreadCount = await prisma.notification.count({
      where: {
        userId: userId,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      updatedCount: result.count,
      unreadCount,
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json({ error: 'Failed to mark notifications as read' }, { status: 500 });
  }
}
