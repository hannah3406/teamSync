import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// 에러 응답 타입
interface ErrorResponse {
  error: string;
}

// 알림 타입 정의
type NotificationType = 'mention' | 'comment' | 'assignment' | 'project_update' | 'task_update';

// 통계 응답 타입
interface NotificationStatsResponse {
  total: number;
  unread: number;
  unreadByType: Partial<Record<NotificationType, number>>;
}

export async function GET(): Promise<NextResponse<NotificationStatsResponse | ErrorResponse>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    // 타입별 읽지 않은 알림 개수
    const unreadByType = await prisma.notification.groupBy({
      by: ['type'],
      where: {
        userId: userId,
        isRead: false,
      },
      _count: {
        id: true,
      },
    });

    // 전체 통계
    const stats = await prisma.notification.aggregate({
      where: {
        userId: userId,
      },
      _count: {
        id: true,
      },
    });

    const unreadTotal = await prisma.notification.count({
      where: {
        userId: userId,
        isRead: false,
      },
    });

    return NextResponse.json({
      total: stats._count.id,
      unread: unreadTotal,
      unreadByType: unreadByType.reduce((acc, item) => {
        acc[item.type as NotificationType] = item._count.id;
        return acc;
      }, {} as Partial<Record<NotificationType, number>>),
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    return NextResponse.json({ error: 'Failed to fetch notification stats' }, { status: 500 });
  }
}
