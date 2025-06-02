'use client';

import { useState, useEffect, useCallback } from 'react';

// 알림 타입 정의
export type NotificationType = 'mention' | 'comment' | 'assignment' | 'project_update' | 'task_update';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  entityType: string | null;
  entityId: string | null;
  createdAt: Date;
}

export interface NotificationStats {
  total: number;
  unread: number;
  unreadByType: Partial<Record<NotificationType, number>>;
}

export interface UseNotificationsReturn {
  // 데이터
  unreadCount: number;
  stats: NotificationStats | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  refreshUnreadCount: () => void;
  markAllAsRead: () => Promise<void>;
}

const POLLING_INTERVAL = 30000; // 30초마다 폴링

export function useNotifications(): UseNotificationsReturn {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 읽지 않은 개수 조회
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch notification stats');
      }

      const data: NotificationStats = await response.json();
      setUnreadCount(data.unread);
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notification stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 전체 읽음 처리
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      const data = await response.json();
      setUnreadCount(data.unreadCount);

      // stats도 업데이트
      if (stats) {
        setStats({
          ...stats,
          unread: data.unreadCount,
          unreadByType: {}, // 모두 읽음 처리되었으므로 빈 객체
        });
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [stats]);

  // 초기 로드
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // 폴링 설정
  useEffect(() => {
    const interval = setInterval(fetchUnreadCount, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // 페이지 포커스 시 새로고침
  useEffect(() => {
    const handleFocus = () => {
      fetchUnreadCount();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    stats,
    isLoading,
    error,
    refreshUnreadCount: fetchUnreadCount,
    markAllAsRead,
  };
}
