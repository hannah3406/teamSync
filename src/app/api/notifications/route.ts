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

// 응답 타입 정의 (Prisma에서 생성된 타입 활용)
type NotificationSelect = Prisma.NotificationGetPayload<{
  select: {
    id: true;
    type: true;
    message: true;
    isRead: true;
    entityType: true;
    entityId: true;
    createdAt: true;
  };
}>;

interface NotificationListResponse {
  notifications: NotificationSelect[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
  };
  unreadCount: number;
}

export async function GET(request: NextRequest): Promise<NextResponse<NotificationListResponse | ErrorResponse>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    // 쿼리 파라미터
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // 최대 50개
    const onlyUnread = searchParams.get('unread') === 'true';
    const typeParam = searchParams.get('type');

    // 타입 검증
    const validTypes: NotificationType[] = ['mention', 'comment', 'assignment', 'project_update', 'task_update'];
    const type =
      typeParam && validTypes.includes(typeParam as NotificationType) ? (typeParam as NotificationType) : undefined;

    const skip = (page - 1) * limit;

    // 필터 조건 구성
    const where: Prisma.NotificationWhereInput = {
      userId: userId,
      ...(onlyUnread && { isRead: false }),
      ...(type && { type }),
    };

    // 전체 개수 조회
    const totalCount = await prisma.notification.count({ where });

    // 읽지 않은 알림 개수
    const unreadCount = await prisma.notification.count({
      where: {
        userId: userId,
        isRead: false,
      },
    });

    // 알림 목록 조회
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        message: true,
        isRead: true,
        entityType: true,
        entityId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
      },
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
