import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarIcon,
  CheckSquareIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
  ClockIcon,
  CheckCircle2Icon,
  CircleIcon,
  TargetIcon,
  TagIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import ProjectEditDialog from '../project-edit-dialog';
import ProjectDeleteDialog from '../project-delete-dialog';
import ProjectTaskList from '../project-task-list';
import ProjectMembersList from '../project-members-list';
import LabelManagementDialog from '../label-management-dialog';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    select: { name: true },
  });

  return {
    title: project ? `${project.name} | TeamSync` : '프로젝트 | TeamSync',
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
      team: true,
      members: {
        include: {
          user: true,
        },
      },
      milestones: {
        orderBy: {
          dueDate: 'asc',
        },
      },
      tasks: {
        include: {
          assignee: true,
          labels: {
            include: {
              label: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          tasks: true,
          members: true,
          documents: true,
        },
      },
    },
  });

  // 프로젝트가 없거나 멤버가 아닌 경우
  const isMember = project?.members.some((member) => member.userId === session.user.id);
  if (!project || !isMember) {
    notFound();
  }

  // 현재 사용자의 역할 확인
  const currentUserRole = project.members.find((member) => member.userId === session.user.id)?.role;
  const canEdit = currentUserRole === 'owner' || currentUserRole === 'admin';

  // 태스크 상태별 개수 계산
  const taskStats = {
    total: project.tasks.length,
    todo: project.tasks.filter((t) => t.status === 'todo').length,
    inProgress: project.tasks.filter((t) => t.status === 'in_progress').length,
    done: project.tasks.filter((t) => t.status === 'done').length,
  };

  // 진행률 계산
  const progressPercentage = taskStats.total > 0 ? Math.round((taskStats.done / taskStats.total) * 100) : 0;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* 헤더 */}
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.description && <p className="text-muted-foreground mt-2">{project.description}</p>}
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            <LabelManagementDialog projectId={project.id} projectName={project.name}>
              <Button variant="outline" size="sm">
                <TagIcon className="h-4 w-4 mr-2" />
                라벨 관리
              </Button>
            </LabelManagementDialog>
            <ProjectEditDialog project={project}>
              <Button variant="outline" size="sm">
                <PencilIcon className="h-4 w-4 mr-2" />
                수정
              </Button>
            </ProjectEditDialog>
            <ProjectDeleteDialog projectId={project.id} projectName={project.name}>
              <Button variant="outline" size="sm">
                <TrashIcon className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </ProjectDeleteDialog>
          </div>
        )}
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 태스크</CardTitle>
            <CheckSquareIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
            <p className="text-xs text-muted-foreground">진행률 {progressPercentage}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행 중</CardTitle>
            <ClockIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">{taskStats.todo}개 대기 중</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료됨</CardTitle>
            <CheckCircle2Icon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.done}</div>
            <p className="text-xs text-muted-foreground">{taskStats.total > 0 ? progressPercentage : 0}% 완료</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">팀원</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project._count.members}</div>
            <p className="text-xs text-muted-foreground">{project._count.documents}개 문서</p>
          </CardContent>
        </Card>
      </div>

      {/* 탭 콘텐츠 */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">태스크</TabsTrigger>
          <TabsTrigger value="members">멤버</TabsTrigger>
          <TabsTrigger value="milestones">마일스톤</TabsTrigger>
          <TabsTrigger value="overview">개요</TabsTrigger>
        </TabsList>

        {/* 태스크 탭 */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">태스크 목록</h2>
            <Link href={`/dashboard/tasks?projectId=${project.id}`}>
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />새 태스크
              </Button>
            </Link>
          </div>
          <ProjectTaskList tasks={project.tasks} projectId={project.id} />
        </TabsContent>

        {/* 멤버 탭 */}
        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">프로젝트 멤버</h2>
            {canEdit && (
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                멤버 초대
              </Button>
            )}
          </div>
          <ProjectMembersList members={project.members} currentUserId={session.user.id} canManage={canEdit} />
        </TabsContent>

        {/* 마일스톤 탭 */}
        <TabsContent value="milestones" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">마일스톤</h2>
            {canEdit && (
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />새 마일스톤
              </Button>
            )}
          </div>
          {project.milestones.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <TargetIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">아직 마일스톤이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {project.milestones.map((milestone) => (
                <Card key={milestone.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                        )}
                      </div>
                      {milestone.status === 'completed' ? (
                        <Badge className="bg-green-500">완료</Badge>
                      ) : milestone.dueDate && new Date(milestone.dueDate) < new Date() ? (
                        <Badge variant="destructive">지연</Badge>
                      ) : (
                        <Badge>진행 중</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {milestone.dueDate && new Date(milestone.dueDate) < new Date() && (
                          <span>{format(new Date(milestone.dueDate), 'yyyy년 MM월 dd일', { locale: ko })}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 개요 탭 */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>프로젝트 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">소유자</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={project.owner.image || ''} alt={project.owner.name || ''} />
                      <AvatarFallback>
                        {project.owner.name?.charAt(0) || project.owner.email?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{project.owner.name || project.owner.email}</span>
                  </div>
                </div>

                {project.team && (
                  <div>
                    <p className="text-sm text-muted-foreground">팀</p>
                    <p className="text-sm mt-1">{project.team.name}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">생성일</p>
                  <p className="text-sm mt-1">
                    {format(new Date(project.createdAt), 'yyyy년 MM월 dd일', { locale: ko })}
                  </p>
                </div>

                {project.startDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">시작일</p>
                    <p className="text-sm mt-1">
                      {format(new Date(project.startDate), 'yyyy년 MM월 dd일', { locale: ko })}
                    </p>
                  </div>
                )}

                {project.endDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">종료일</p>
                    <p className="text-sm mt-1">
                      {format(new Date(project.endDate), 'yyyy년 MM월 dd일', { locale: ko })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>진행 상황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">전체 진행률</span>
                      <span className="text-sm font-medium">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <CircleIcon className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-2xl font-bold">{taskStats.todo}</p>
                      <p className="text-xs text-muted-foreground">할 일</p>
                    </div>
                    <div>
                      <ClockIcon className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold">{taskStats.inProgress}</p>
                      <p className="text-xs text-muted-foreground">진행 중</p>
                    </div>
                    <div>
                      <CheckCircle2Icon className="h-4 w-4 text-green-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold">{taskStats.done}</p>
                      <p className="text-xs text-muted-foreground">완료</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
