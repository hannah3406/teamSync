// task-edit-dialog.tsx 수정
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

interface TaskEditDialogProps {
  children: React.ReactNode;
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: string | Date | null;
    projectId?: string;
    labels?: Array<{
      label: {
        id: string;
        name: string;
        color: string;
      };
    }>;
  };
}

export default function TaskEditDialog({ children, task }: TaskEditDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState<Date | undefined>(task.dueDate ? new Date(task.dueDate) : undefined);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(task.labels?.map((tl) => tl.label.id) || []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      const response = await fetch(`/api/task/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
          dueDate: dueDate ? dueDate.toISOString() : null,
          labelIds: selectedLabels,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '태스크 수정 중 오류가 발생했습니다.');
      }

      // 수정 성공
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Task update error:', error);
      setError(error instanceof Error ? error.message : '태스크 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
    setSelectedLabels(task.labels?.map((tl) => tl.label.id) || []);
    setError(null);
  };

  return (
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
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>태스크 수정</DialogTitle>
            <DialogDescription>태스크 정보를 수정하세요. 변경사항은 즉시 반영됩니다.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* 태스크 제목 */}
            <div className="grid gap-2">
              <Label htmlFor="title">태스크 제목</Label>
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
              <Label htmlFor="description">설명</Label>
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

            {/* 마감일 선택 */}
            <div className="grid gap-2">
              <Label htmlFor="dueDate">마감일</Label>
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

            {/* 라벨 선택 - 새로 추가 */}
            {task.projectId && (
              <div className="grid gap-2">
                <Label htmlFor="labels">라벨</Label>
                <LabelSelector
                  projectId={task.projectId}
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
              {isLoading ? '수정 중...' : '태스크 수정'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
