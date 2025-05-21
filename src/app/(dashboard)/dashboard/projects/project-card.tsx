'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, FolderIcon, UsersIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    team: {
      name: string;
    } | null;
    createdAt: Date;
    _count: {
      tasks: number;
    };
  };
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  // 프로젝트 상세 페이지로 이동
  const handleClick = () => {
    router.push(`/dashboard/projects/${project.id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-lg">{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
          {project.description || '설명이 없습니다.'}
        </p>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <UsersIcon className="h-4 w-4 mr-2" />
          <span>{project.team?.name || '팀 없음'}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <FolderIcon className="h-4 w-4 mr-2" />
          <span>태스크 {project._count.tasks}개</span>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-3">
        <div className="flex items-center">
          <CalendarIcon className="h-3 w-3 mr-1" />
          <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true, locale: ko })}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
