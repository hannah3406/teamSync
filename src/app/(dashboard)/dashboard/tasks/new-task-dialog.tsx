/* src/app/(dashboard)/dashboard/tasks/new-task-dialog.tsx */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import LabelSelector from './label-selector';

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

interface NewTaskDialogProps {
  children: React.ReactNode;
  projects: Project[];
}

export default function NewTaskDialog({ children, projects }: NewTaskDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [showProjectPrompt, setShowProjectPrompt] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasProjects = projects.length > 0;

  const handleOpenDialog = () => {
    if (hasProjects) {
      setOpen(true);
    } else {
      setShowProjectPrompt(true);
    }
  };

  const navigateToCreateProject = () => {
    router.push('/dashboard/projects');
  };

  const handleProjectChange = (value: string) => {
    setProjectId(value);
    setSelectedLabels([]);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDueDate(date);
    setCalendarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!title.trim()) {
      setError('태스크 제목을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!projectId) {
      setError('프로젝트를 선택해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          projectId,
          status,
          priority,
          dueDate: dueDate ? dueDate.toISOString() : null,
          labelIds: selectedLabels,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '태스크 생성 중 오류가 발생했습니다.');
      }

      // 태스크 생성 성공
      setOpen(false);
      resetForm();

      // 커스텀 이벤트 발생시켜 태스크 리스트 갱신
      window.dispatchEvent(new Event('taskCreated'));

      // router.refresh()는 제거하거나 유지 (선택사항)
      // router.refresh(); // 다른 서버 컴포넌트 갱신이 필요한 경우 유지
    } catch (error) {
      console.error('Task creation error:', error);
      setError(error instanceof Error ? error.message : '태스크 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setProjectId('');
    setStatus('todo');
    setPriority('medium');
    setDueDate(undefined);
    setSelectedLabels([]);
    setError(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) {
            resetForm();
            setCalendarOpen(false);
          }
        }}
      >
        <DialogTrigger
          asChild
          onClick={(e) => {
            e.preventDefault();
            handleOpenDialog();
          }}
        >
          {children}
        </DialogTrigger>

        <DialogContent className="sm:max-w-[550px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>새 태스크 생성</DialogTitle>
              <DialogDescription>
                새 태스크의 정보를 입력하세요. 생성 후에도 모든 정보를 수정할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* 태스크 제목 */}
              <div className="grid gap-2">
                <Label htmlFor="title" className="required">
                  태스크 제목
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="태스크 제목을 입력하세요"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* 태스크 설명 */}
              <div className="grid gap-2">
                <Label htmlFor="description">설명 (선택)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="태스크에 대한 설명을 입력하세요"
                  disabled={isLoading}
                  className="resize-none"
                  rows={3}
                />
              </div>

              {/* 프로젝트 선택 */}
              <div className="grid gap-2">
                <Label htmlFor="project" className="required">
                  프로젝트
                </Label>
                <Select value={projectId} onValueChange={handleProjectChange} disabled={isLoading} required>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="프로젝트 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 상태 및 우선순위 선택 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">상태</Label>
                  <Select value={status} onValueChange={setStatus} disabled={isLoading}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">할 일</SelectItem>
                      <SelectItem value="in_progress">진행 중</SelectItem>
                      <SelectItem value="done">완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priority">우선순위</Label>
                  <Select value={priority} onValueChange={setPriority} disabled={isLoading}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="우선순위 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">낮음</SelectItem>
                      <SelectItem value="medium">중간</SelectItem>
                      <SelectItem value="high">높음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 마감일 선택 - 개선된 부분 */}
              <div className="grid gap-2">
                <Label htmlFor="dueDate">마감일 (선택)</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen} modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      id="dueDate"
                      type="button"
                      variant="outline"
                      className={cn('w-full justify-start text-left font-normal', !dueDate && 'text-muted-foreground')}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, 'PPP', { locale: ko }) : '마감일 선택'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    sideOffset={4}
                    style={{
                      zIndex: 9999,
                      position: 'relative',
                    }}
                  >
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* 라벨 선택 - 개선된 버전 */}
              {projectId && (
                <div className="grid gap-2">
                  <Label htmlFor="labels">라벨 (선택)</Label>
                  <LabelSelector
                    projectId={projectId}
                    selectedLabels={selectedLabels}
                    onChange={setSelectedLabels}
                    disabled={isLoading}
                    placeholder="라벨을 선택하세요"
                  />
                </div>
              )}
              {/* 에러 메시지 */}
              {error && (
                <div className="flex items-center text-sm text-destructive gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '생성 중...' : '태스크 생성'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 프로젝트 생성 안내 대화상자 */}
      <Dialog open={showProjectPrompt} onOpenChange={setShowProjectPrompt}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>프로젝트가 필요합니다</DialogTitle>
            <DialogDescription>
              태스크를 생성하려면 먼저 프로젝트가 필요합니다. 지금 프로젝트를 생성하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowProjectPrompt(false)}>
              취소
            </Button>
            <Button onClick={navigateToCreateProject}>프로젝트 생성하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
