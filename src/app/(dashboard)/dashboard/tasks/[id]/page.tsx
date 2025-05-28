import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  CalendarIcon,
  CheckCircle2Icon,
  CircleIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  TagIcon,
  FolderIcon,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import TaskStatusSelect from '../task-status-select';
import TaskEditDialog from '../task-edit-dialog';
import TaskDeleteDialog from '../task-delete-dialog';
import TaskCommentSection from '../task-comment-section';

interface TaskPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: TaskPageProps): Promise<Metadata> {
  const task = await prisma.task.findUnique({
    where: { id: params.id },
    select: { title: true },
  });

  return {
    title: task ? `${task.title} | TeamSync` : '태스크 | TeamSync',
  };
}

export default async function TaskPage({ params }: TaskPageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: {
      project: {
        include: {
          members: {
            where: {
              userId: session.user.id,
            },
          },
        },
      },
      assignee: true,
      milestone: true,
      labels: {
        include: {
          label: true,
        },
      },
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  // 태스크가 없거나 접근 권한이 없는 경우
  if (!task || task.project.members.length === 0) {
    notFound();
  }

  // 상태에 따른 아이콘
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2Icon className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <CircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  // 우선순위 배지
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">높음</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500">중간</Badge>;
      case 'low':
        return <Badge className="bg-blue-500">낮음</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon(task.status)}
          <h1 className="text-2xl font-bold">{task.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <TaskEditDialog task={task}>
            <Button variant="outline" size="sm">
              <PencilIcon className="h-4 w-4 mr-2" />
              수정
            </Button>
          </TaskEditDialog>
          <TaskDeleteDialog taskId={task.id} taskTitle={task.title}>
            <Button variant="outline" size="sm">
              <TrashIcon className="h-4 w-4 mr-2" />
              삭제
            </Button>
          </TaskDeleteDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 메인 콘텐츠 */}
        <div className="md:col-span-2 space-y-6">
          {/* 설명 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">설명</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{task.description || '설명이 없습니다.'}</p>
            </CardContent>
          </Card>

          {/* 댓글 */}
          <TaskCommentSection taskId={task.id} initialComments={task.comments} initialCount={task._count.comments} />
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 상태 */}
          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium">상태</h3>
            </CardHeader>
            <CardContent>
              <TaskStatusSelect taskId={task.id} currentStatus={task.status} />
            </CardContent>
          </Card>

          {/* 세부 정보 */}
          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium">세부 정보</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 담당자 */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">담당자</p>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={task.assignee.image || ''} alt={task.assignee.name || ''} />
                      <AvatarFallback>
                        {task.assignee.name?.charAt(0) || task.assignee.email?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee.name || task.assignee.email}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                    <span className="text-sm">미할당</span>
                  </div>
                )}
              </div>

              {/* 우선순위 */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">우선순위</p>
                {getPriorityBadge(task.priority)}
              </div>

              {/* 프로젝트 */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">프로젝트</p>
                <div className="flex items-center gap-2">
                  <FolderIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{task.project.name}</span>
                </div>
              </div>

              {/* 마감일 */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">마감일</p>
                {task.dueDate ? (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(task.dueDate), 'yyyy년 MM월 dd일', { locale: ko })}
                    </span>
                    {new Date(task.dueDate) < new Date() && (
                      <Badge variant="destructive" className="text-xs">
                        지남
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-sm">설정 안 됨</span>
                  </div>
                )}
              </div>

              {/* 마일스톤 */}
              {task.milestone && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">마일스톤</p>
                  <Badge variant="outline">{task.milestone.title}</Badge>
                </div>
              )}

              {/* 라벨 */}
              {task.labels.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">라벨</p>
                  <div className="flex flex-wrap gap-2">
                    {task.labels.map(({ label }) => (
                      <div
                        key={label.id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border"
                        style={{
                          backgroundColor: `${label.color}20`,
                          borderColor: label.color,
                          color: label.color,
                        }}
                      >
                        <TagIcon className="h-3 w-3" />
                        {label.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 생성일 */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">생성일</p>
                <span className="text-sm">
                  {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true, locale: ko })}
                </span>
              </div>

              {/* 최종 수정일 */}
              {task.updatedAt !== task.createdAt && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">최종 수정일</p>
                  <span className="text-sm">
                    {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true, locale: ko })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
