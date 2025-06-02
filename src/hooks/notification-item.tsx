'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageSquare, AtSign, UserPlus, FolderOpen, CheckSquare, MoreVertical, Eye, Trash2 } from 'lucide-react';
import { NotificationItem as NotificationItemType, NotificationType } from '@/types/notifications';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: NotificationItemType;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: NotificationItemType) => void;
}

// 알림 타입별 아이콘
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'comment':
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case 'mention':
      return <AtSign className="h-4 w-4 text-purple-500" />;
    case 'assignment':
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case 'project_update':
      return <FolderOpen className="h-4 w-4 text-orange-500" />;
    case 'task_update':
      return <CheckSquare className="h-4 w-4 text-cyan-500" />;
    default:
      return <MessageSquare className="h-4 w-4 text-gray-500" />;
  }
};

// 알림 타입별 라벨
const getNotificationLabel = (type: NotificationType) => {
  switch (type) {
    case 'comment':
      return '댓글';
    case 'mention':
      return '멘션';
    case 'assignment':
      return '할당';
    case 'project_update':
      return '프로젝트';
    case 'task_update':
      return '태스크';
    default:
      return '알림';
  }
};

export function NotificationItem({ notification, onMarkAsRead, onDelete, onClick }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors rounded-md',
        !notification.isRead && 'bg-primary/5 border-l-2 border-primary'
      )}
      onClick={handleClick}
    >
      {/* 아이콘 */}
      <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type as NotificationType)}</div>

      {/* 컨텐츠 */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* 타입 배지 */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {getNotificationLabel(notification.type as NotificationType)}
          </Badge>
          {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
        </div>

        {/* 메시지 */}
        <p
          className={cn(
            'text-sm leading-relaxed',
            notification.isRead ? 'text-muted-foreground' : 'text-foreground font-medium'
          )}
        >
          {notification.message}
        </p>

        {/* 시간 */}
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: ko,
          })}
        </p>
      </div>

      {/* 액션 메뉴 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!notification.isRead && onMarkAsRead && (
            <DropdownMenuItem onClick={handleMarkAsRead}>
              <Eye className="h-4 w-4 mr-2" />
              읽음으로 표시
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
