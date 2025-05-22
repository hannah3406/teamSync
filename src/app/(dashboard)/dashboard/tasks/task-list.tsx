'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  CalendarIcon,
  CheckCircle2Icon,
  CircleIcon,
  ClockIcon,
  MessageSquareIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
  };
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
  _count: {
    comments: number;
  };
}

export default function TaskList() {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        // 현재 URL의 쿼리 파라미터를 API 요청에 사용
        const queryString = searchParams.toString();
        const response = await fetch(`/api/task?${queryString}`);

        if (!response.ok) {
          throw new Error('태스크를 불러오는 중 오류가 발생했습니다.');
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err instanceof Error ? err.message : '태스크를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [searchParams]);

  // 상태에 따른 아이콘 및 색상
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

  // 우선순위에 따른 아이콘 및 색상
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 text-red-600 rounded-md">
        <AlertCircleIcon className="h-5 w-5 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/20">
        <h3 className="text-xl font-medium mb-2">태스크가 없습니다</h3>
        <p className="text-muted-foreground mb-4">검색 조건을 변경하거나 새 태스크를 생성하세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Link href={`/dashboard/tasks/${task.id}`} key={task.id}>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <h3 className="font-medium line-clamp-1">{task.title}</h3>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-1">{task.description || '설명 없음'}</p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="bg-blue-50">
                      {task.project.name}
                    </Badge>

                    {getPriorityBadge(task.priority)}

                    {task.labels.length > 0 &&
                      task.labels.map(({ label }) => (
                        <div
                          key={label.id}
                          className="px-2 py-0.5 rounded-full text-xs border"
                          style={{
                            backgroundColor: `${label.color}20`,
                            borderColor: label.color,
                            color: label.color,
                          }}
                        >
                          {label.name}
                        </div>
                      ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                          {new Date(task.dueDate) < new Date() ? (
                            <span className="text-red-500">
                              {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true, locale: ko })}
                              (지남)
                            </span>
                          ) : (
                            formatDistanceToNow(new Date(task.dueDate), { addSuffix: true, locale: ko })
                          )}
                        </span>
                      </div>
                    )}

                    {task._count.comments > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquareIcon className="h-3 w-3" />
                        <span>{task._count.comments}</span>
                      </div>
                    )}
                  </div>
                </div>

                {task.assignee && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={task.assignee.image || ''} alt={task.assignee.name || ''} />
                    <AvatarFallback>
                      {task.assignee.name?.charAt(0) || task.assignee.email?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
