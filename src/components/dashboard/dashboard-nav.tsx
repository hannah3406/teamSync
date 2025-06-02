"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarItem, SidebarSection } from "@/components/layout/sidebar";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  FileText,
  Users,
  Settings,
} from "lucide-react";

const navItems = [
  {
    title: "대시보드",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "태스크",
    href: "/dashboard/tasks",
    icon: <CheckSquare className="h-4 w-4" />,
  },
  {
    title: "프로젝트",
    href: "/dashboard/projects",
    icon: <FolderKanban className="h-4 w-4" />,
  },
  {
    title: "문서",
    href: "/dashboard/documents",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "팀",
    href: "/dashboard/teams",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "설정",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarSection>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <SidebarItem
              icon={item.icon}
              active={
                pathname === item.href || pathname.startsWith(item.href + "/")
              }
            >
              {item.title}
            </SidebarItem>
          </Link>
        ))}
      </SidebarSection>
    </>
  );
}
