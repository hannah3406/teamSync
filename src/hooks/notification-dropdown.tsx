'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NotificationItem } from './notification-item';
import { useNotificationList } from '@/hooks/use-notification-list';
import { useNotifications } from '@/hooks/use-notifications';
import { Bell, Check, Settings, RefreshCw, BellOff, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface NotificationDropdownProps {
  children: React.ReactNode;
}

export function NotificationDropdown({ children }: NotificationDropdownProps) {
  const { markAllAsRead, refreshUnreadCount } = useNotifications();
  const {
    notifications,
    isLoading,
    isLoadingMore,
    hasMore,
    totalCount,
    loadMore,
    markAsRead,
    deleteNotification,
    refresh,
  } = useNotificationList({ limit: 15 });

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    await refresh();
    await refreshUnreadCount();
  };

  const handleRefresh = async () => {
    await refresh();
    await refreshUnreadCount();
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    await refreshUnreadCount();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    await refreshUnreadCount();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end" sideOffset={8} style={{ zIndex: 9999 }}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <h3 className="font-semibold text-sm">알림</h3>
            {totalCount > 0 && <span className="text-xs text-muted-foreground">({totalCount})</span>}
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading} className="h-7 w-7 p-0">
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>

            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-7 px-2 text-xs">
                <Check className="h-3 w-3 mr-1" />
                모두 읽음
              </Button>
            )}
          </div>
        </div>

        {/* 컨텐츠 */}
        <ScrollArea className="h-96">
          {isLoading ? (
            // 로딩 스켈레톤
            <div className="space-y-1 p-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3">
                  <Skeleton className="h-4 w-4 rounded-full mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            // 빈 상태
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <BellOff className="h-8 w-8 text-muted-foreground mb-3" />
              <h4 className="text-sm font-medium mb-1">알림이 없습니다</h4>
              <p className="text-xs text-muted-foreground">새로운 알림이 있으면 여기에 표시됩니다.</p>
            </div>
          ) : (
            // 알림 목록
            <div className="space-y-1 p-2">
              {notifications.map((notification) => (
                <div key={notification.id} className="group">
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                </div>
              ))}

              {/* 더보기 버튼 */}
              {hasMore && (
                <div className="p-2">
                  <Button variant="ghost" className="w-full text-xs" onClick={loadMore} disabled={isLoadingMore}>
                    {isLoadingMore ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                        로딩 중...
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-2" />
                        더보기
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* 푸터 */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-xs" asChild>
                <Link href="/dashboard/notifications">
                  <Settings className="h-3 w-3 mr-2" />
                  모든 알림 보기
                </Link>
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
