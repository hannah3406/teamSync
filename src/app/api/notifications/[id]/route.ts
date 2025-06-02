import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';

interface RouteParams {
  params: {
    id: string;
  };
}

// 에러 응답 타입
interface ErrorResponse {
  error: string;
}

// 알림 응답 타입 (Prisma 자동 생성 타입 활용)
type NotificationResponse = Prisma.NotificationGetPayload<{
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

// 읽음 처리 요청 타입
interface MarkAsReadRequest {
  isRead?: boolean;
}

// 개별 알림 읽음 처리 (PATCH)
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<NotificationResponse | ErrorResponse>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const notificationId = params.id;
    const userId = session.user.id;
    const body: MarkAsReadRequest = await request.json();
    const { isRead } = body;

    // 알림이 현재 사용자의 것인지 확인
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: userId,
      },
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // 읽음 상태 업데이트
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: isRead !== undefined ? isRead : true },
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

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

// 개별 알림 삭제 (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ success: boolean } | ErrorResponse>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const notificationId = params.id;
    const userId = session.user.id;

    // 알림이 현재 사용자의 것인지 확인
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: userId,
      },
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // 알림 삭제
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
