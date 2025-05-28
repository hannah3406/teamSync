'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle2Icon, CircleIcon, ClockIcon, CalendarIcon, UserIcon, FilterIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | Date | null;
  assignee: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  labels: {
    label: {
      id: string;
      name: string;
      color: string;
    };
  }[];
}

interface ProjectTaskListProps {
  tasks: Task[];
  projectId: string;
}

export default function ProjectTaskList({ tasks, projectId }: ProjectTaskListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // 필터링된 태스크
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  // 상태에 따른 아이콘
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2Icon className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <ClockIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <CircleIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  // 우선순위 배지
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500 text-xs">높음</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500 text-xs">중간</Badge>;
      case 'low':
        return <Badge className="bg-blue-500 text-xs">낮음</Badge>;
      default:
        return null;
    }
  };

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <CircleIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">아직 태스크가 없습니다.</p>
          <Link href={`/dashboard/tasks?projectId=${projectId}`}>
            <Button className="mt-4" size="sm">
              첫 태스크 만들기
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 필터 */}
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <FilterIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            <SelectItem value="todo">할 일</SelectItem>
            <SelectItem value="in_progress">진행 중</SelectItem>
            <SelectItem value="done">완료</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[170px]">
            <FilterIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="우선순위 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 우선순위</SelectItem>
            <SelectItem value="high">높음</SelectItem>
            <SelectItem value="medium">중간</SelectItem>
            <SelectItem value="low">낮음</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 태스크 목록 */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">필터 조건에 맞는 태스크가 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <Link href={`/dashboard/tasks/${task.id}`} key={task.id}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <h4 className="font-medium line-clamp-1">{task.title}</h4>
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {getPriorityBadge(task.priority)}

                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>
                              {(() => {
                                const dueDate = new Date(task.dueDate);
                                const isOverdue = dueDate < new Date();
                                return isOverdue ? (
                                  <span className="text-red-500">
                                    {formatDistanceToNow(dueDate, { addSuffix: true, locale: ko })}
                                  </span>
                                ) : (
                                  formatDistanceToNow(dueDate, { addSuffix: true, locale: ko })
                                );
                              })()}
                            </span>
                          </div>
                        )}

                        {task.labels.length > 0 && (
                          <div className="flex gap-1">
                            {task.labels.map(({ label }) => (
                              <div
                                key={label.id}
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: label.color }}
                                title={label.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {task.assignee ? (
                      <Avatar className="h-8 w-8 ml-4">
                        <AvatarImage src={task.assignee.image || ''} alt={task.assignee.name || ''} />
                        <AvatarFallback>
                          {task.assignee.name?.charAt(0) || task.assignee.email?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 ml-4 rounded-full bg-muted flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
