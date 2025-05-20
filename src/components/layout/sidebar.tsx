import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <div className={cn('h-screen w-64 border-r bg-background', className)} {...props}>
      <div className="py-4 px-3 h-full flex flex-col">{children}</div>
    </div>
  );
}

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="mb-4">
      {title && <h3 className="text-sm font-medium mb-2 text-muted-foreground">{title}</h3>}
      <div>{children}</div>
    </div>
  );
}

interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}

export function SidebarItem({ icon, children, active, ...props }: SidebarItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors',
        active && 'bg-accent text-accent-foreground'
      )}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
