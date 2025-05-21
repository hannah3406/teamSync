import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProjectCard from './project-card';
import NewProjectDialog from './new-project-dialog';

export const metadata: Metadata = {
  title: '프로젝트 | TeamSync',
  description: '프로젝트 목록을 관리하세요',
};

export default async function ProjectsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // 현재 사용자의 프로젝트 조회
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: session.user.id }, // 소유한 프로젝트
        {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        }, // 멤버로 참여 중인 프로젝트
      ],
    },
    include: {
      team: true,
      _count: {
        select: {
          tasks: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">프로젝트</h2>
        <NewProjectDialog>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />새 프로젝트
          </Button>
        </NewProjectDialog>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/20">
          <h3 className="text-xl font-medium mb-2">아직 프로젝트가 없습니다</h3>
          <p className="text-muted-foreground mb-4">새 프로젝트를 생성하여 팀과 함께 작업을 시작하세요.</p>
          <NewProjectDialog>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              프로젝트 생성하기
            </Button>
          </NewProjectDialog>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
