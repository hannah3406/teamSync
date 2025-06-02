'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';

import { cn } from '@/lib/utils';
import { NotificationDropdown } from '@/hooks/notification-dropdown';

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const { unreadCount, isLoading } = useNotifications();

  return (
    <NotificationDropdown>
      <Button variant="ghost" size="icon" className={cn('relative h-8 w-8', className)} disabled={isLoading}>
        <Bell className="h-4 w-4" />

        {/* 읽지 않은 알림 배지 */}
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500 text-white border-2 border-background"
            variant="destructive"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}

        {/* 로딩 시 시각적 피드백 */}
        {isLoading && <div className="absolute inset-0 rounded-md bg-muted/20 animate-pulse" />}
      </Button>
    </NotificationDropdown>
  );
}
