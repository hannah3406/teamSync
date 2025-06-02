import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

export function Navbar({ className, children, ...props }: NavbarProps) {
  return (
    <nav className={cn('h-16 border-b bg-background flex items-center px-6 justify-between', className)} {...props}>
      {children}
    </nav>
  );
}

interface NavbarBrandProps {
  children: React.ReactNode;
  href?: string;
}

export function NavbarBrand({ children, href = '/' }: NavbarBrandProps) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold text-lg">
      {children}
    </Link>
  );
}

interface NavbarItemsProps {
  children: React.ReactNode;
}

export function NavbarItems({ children }: NavbarItemsProps) {
  return <div className="flex items-center gap-2">{children}</div>;
}

interface NavbarItemProps {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
}

export function NavbarItem({ children, href, active }: NavbarItemProps) {
  const Component = href ? Link : 'div';

  return (
    <Component
      href={href || '#'}
      className={cn('px-3 py-2 text-sm font-medium transition-colors hover:text-primary', active && 'text-primary')}
    >
      {children}
    </Component>
  );
}
