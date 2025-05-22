import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';

import TaskFilters from './task-filters';
import TaskList from './task-list';
import NewTaskDialog from './new-task-dialog';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '태스크 | TeamSync',
  description: '태스크 목록을 관리하세요',
};

export default async function TasksPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // 사용자가 접근 가능한 프로젝트 목록 조회 (태스크 생성 시 필요)
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      ],
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      name: true,
    },
  });

  // 라벨 목록 조회 (필터링 시 필요)
  const labels = await prisma.label.findMany({
    where: {
      project: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      color: true,
      projectId: true,
    },
  });

  // 프로젝트 유무에 따른 UI 변화
  const hasProjects = projects.length > 0;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">태스크</h2>
        <NewTaskDialog projects={projects} labels={labels}>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />새 태스크
          </Button>
        </NewTaskDialog>
      </div>

      {hasProjects ? (
        <>
          <TaskFilters projects={projects} labels={labels} />
          <TaskList />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/20">
          <h3 className="text-xl font-medium mb-2">프로젝트가 없습니다</h3>
          <p className="text-muted-foreground mb-4">태스크를 생성하려면 먼저 프로젝트를 생성해야 합니다.</p>
          <Button asChild>
            <Link href="/dashboard/projects">
              <PlusIcon className="mr-2 h-4 w-4" />
              프로젝트 생성하기
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
