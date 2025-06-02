'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications, UseNotificationsReturn } from '@/hooks/use-notifications';

const NotificationContext = createContext<UseNotificationsReturn | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const notifications = useNotifications();

  return <NotificationContext.Provider value={notifications}>{children}</NotificationContext.Provider>;
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
