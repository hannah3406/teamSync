'use client';

import { useState, useEffect, useCallback } from 'react';
import { NotificationItem } from '@/types/notifications';

interface UseNotificationListReturn {
  notifications: NotificationItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;

  // 액션
  fetchNotifications: () => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

interface FetchParams {
  page?: number;
  limit?: number;
  unread?: boolean;
  type?: string;
}

export function useNotificationList(params: FetchParams = {}): UseNotificationListReturn {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const limit = params.limit || 10;

  // 알림 목록 조회
  const fetchNotifications = useCallback(
    async (page = 1, append = false) => {
      try {
        if (page === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(params.unread && { unread: 'true' }),
          ...(params.type && { type: params.type }),
        });

        const response = await fetch(`/api/notifications?${searchParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();

        if (append) {
          setNotifications((prev) => [...prev, ...data.notifications]);
        } else {
          setNotifications(data.notifications);
        }

        setCurrentPage(page);
        setHasMore(data.pagination.hasNext);
        setTotalCount(data.pagination.totalCount);
        setError(null);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [limit, params.unread, params.type]
  );

  // 더보기 로드
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;
    await fetchNotifications(currentPage + 1, true);
  }, [currentPage, hasMore, isLoadingMore, fetchNotifications]);

  // 개별 읽음 처리
  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notification/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      // 로컬 상태 업데이트
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // 알림 삭제
  const deleteNotification = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notification/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      // 로컬 상태 업데이트
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, []);

  // 새로고침
  const refresh = useCallback(async () => {
    setCurrentPage(1);
    await fetchNotifications(1, false);
  }, [fetchNotifications]);

  // 초기 로드
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    totalCount,
    fetchNotifications: () => fetchNotifications(1, false),
    loadMore,
    markAsRead,
    deleteNotification,
    refresh,
  };
}
