/* src/app/(dashboard)/dashboard/tasks/task-list.tsx */
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export default function TaskList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1');

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryString = searchParams.toString();
      const response = await fetch(`/api/task?${queryString}`);

      if (!response.ok) {
        throw new Error('태스크를 불러오는 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : '태스크를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchParams]);

  // 태스크 생성 이벤트 리스너
  useEffect(() => {
    const handleTaskCreated = () => {
      fetchTasks();
    };

    window.addEventListener('taskCreated', handleTaskCreated);
    return () => {
      window.removeEventListener('taskCreated', handleTaskCreated);
    };
  }, [searchParams]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // 페이지 번호 생성 로직
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (pagination.totalPages <= maxVisible) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(pagination.totalPages);
      } else if (currentPage >= pagination.totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = pagination.totalPages - 3; i <= pagination.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(pagination.totalPages);
      }
    }

    return pages;
  };

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

  if (tasks.length === 0 && currentPage === 1) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/20">
        <h3 className="text-xl font-medium mb-2">태스크가 없습니다</h3>
        <p className="text-muted-foreground mb-4">검색 조건을 변경하거나 새 태스크를 생성하세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 태스크 리스트 */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Link href={`/dashboard/tasks/${task.id}`} key={task.id} className="block">
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

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            총 {pagination.totalCount}개 중 {(currentPage - 1) * pagination.limit + 1}-
            {Math.min(currentPage * pagination.limit, pagination.totalCount)}개 표시
          </p>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {generatePageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
