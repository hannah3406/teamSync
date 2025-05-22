'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

type Project = {
  id: string;
  name: string;
};

type Label = {
  id: string;
  name: string;
  color: string;
  projectId: string;
};

interface TaskFiltersProps {
  projects: Project[];
  labels: Label[];
}

export default function TaskFilters({ projects }: TaskFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 현재 URL의 쿼리 파라미터에서 필터 상태 초기화
  const [filters, setFilters] = useState({
    projectId: searchParams.get('projectId') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    assigneeId: searchParams.get('assigneeId') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  });

  // 필터 변경 시 URL 업데이트
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.projectId) params.set('projectId', filters.projectId);
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.assigneeId) params.set('assigneeId', filters.assigneeId);
    if (filters.sortBy !== 'createdAt') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);

    router.push(`${pathname}?${params.toString()}`);
  }, [filters, pathname, router]);

  // 특정 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string) => {
    // 'all' 값은 빈 문자열로 변환하여 필터링에서 제외
    const filterValue = value === 'all' ? '' : value;
    setFilters((prev) => ({ ...prev, [key]: filterValue }));
  };

  // 모든 필터 초기화
  const clearAllFilters = () => {
    setFilters({
      projectId: '',
      status: '',
      priority: '',
      assigneeId: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  // 선택된 필터가 있는지 확인
  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value &&
      !(value === 'createdAt' && filters.sortBy === 'createdAt') &&
      !(value === 'desc' && filters.sortOrder === 'desc')
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center">
        {/* 프로젝트 필터 */}
        <div className="mr-2 mb-2 w-[200px]">
          <Select value={filters.projectId} onValueChange={(value) => handleFilterChange('projectId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="모든 프로젝트" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 프로젝트</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 상태 필터 */}
        <div className="mr-2 mb-2 w-[150px]">
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="모든 상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="todo">할 일</SelectItem>
              <SelectItem value="in_progress">진행 중</SelectItem>
              <SelectItem value="done">완료</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 우선순위 필터 */}
        <div className="mr-2 mb-2 w-[150px]">
          <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
            <SelectTrigger>
              <SelectValue placeholder="모든 우선순위" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 우선순위</SelectItem>
              <SelectItem value="low">낮음</SelectItem>
              <SelectItem value="medium">중간</SelectItem>
              <SelectItem value="high">높음</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 담당자 필터 */}
        <div className="mr-2 mb-2 w-[150px]">
          <Select value={filters.assigneeId} onValueChange={(value) => handleFilterChange('assigneeId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="모든 담당자" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 담당자</SelectItem>
              <SelectItem value="me">내 태스크</SelectItem>
              <SelectItem value="unassigned">미할당</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 정렬 기준 */}
        <div className="mr-2 mb-2 w-[150px]">
          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
            <SelectTrigger>
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">생성일</SelectItem>
              <SelectItem value="dueDate">마감일</SelectItem>
              <SelectItem value="priority">우선순위</SelectItem>
              <SelectItem value="title">제목</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 정렬 순서 */}
        <div className="mr-2 mb-2 w-[150px]">
          <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value)}>
            <SelectTrigger>
              <SelectValue placeholder="정렬 순서" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">내림차순</SelectItem>
              <SelectItem value="asc">오름차순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 필터 초기화 버튼 */}
        {hasActiveFilters && (
          <div className="mb-2">
            <Button variant="outline" size="sm" onClick={clearAllFilters} className="h-10">
              <XIcon className="mr-2 h-4 w-4" />
              필터 초기화
            </Button>
          </div>
        )}
      </div>

      {/* 선택된 필터 표시 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.projectId && (
            <Badge variant="outline" className="flex items-center gap-1">
              프로젝트: {projects.find((p) => p.id === filters.projectId)?.name}
              <XIcon className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('projectId', '')} />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="outline" className="flex items-center gap-1">
              상태: {filters.status === 'todo' ? '할 일' : filters.status === 'in_progress' ? '진행 중' : '완료'}
              <XIcon className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('status', '')} />
            </Badge>
          )}
          {filters.priority && (
            <Badge variant="outline" className="flex items-center gap-1">
              우선순위: {filters.priority === 'low' ? '낮음' : filters.priority === 'medium' ? '중간' : '높음'}
              <XIcon className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('priority', '')} />
            </Badge>
          )}
          {filters.assigneeId && (
            <Badge variant="outline" className="flex items-center gap-1">
              담당자: {filters.assigneeId === 'me' ? '나' : filters.assigneeId === 'unassigned' ? '미할당' : '기타'}
              <XIcon className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('assigneeId', '')} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
