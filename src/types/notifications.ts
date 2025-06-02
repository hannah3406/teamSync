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

export interface NotificationListResponse {
  notifications: NotificationItem[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
  };
  unreadCount: number;
}
