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
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ProjectEditDialogProps {
  children: React.ReactNode;
  project: {
    id: string;
    name: string;
    description: string | null;
    startDate: string | Date | null;
    endDate: string | Date | null;
  };
}

export default function ProjectEditDialog({ children, project }: ProjectEditDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [startDate, setStartDate] = useState<Date | undefined>(
    project.startDate ? new Date(project.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(project.endDate ? new Date(project.endDate) : undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setStartDateOpen(false);
    // 종료일이 시작일보다 이전인 경우 종료일 초기화
    if (date && endDate && date > endDate) {
      setEndDate(undefined);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    setEndDateOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name.trim()) {
      setError('프로젝트 이름을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    // 날짜 유효성 검사
    if (startDate && endDate && startDate > endDate) {
      setError('종료일은 시작일 이후여야 합니다.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/project/${project.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '프로젝트 수정 중 오류가 발생했습니다.');
      }

      // 수정 성공
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Project update error:', error);
      setError(error instanceof Error ? error.message : '프로젝트 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName(project.name);
    setDescription(project.description || '');
    setStartDate(project.startDate ? new Date(project.startDate) : undefined);
    setEndDate(project.endDate ? new Date(project.endDate) : undefined);
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
          setStartDateOpen(false);
          setEndDateOpen(false);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>프로젝트 수정</DialogTitle>
            <DialogDescription>프로젝트 정보를 수정하세요. 변경사항은 즉시 반영됩니다.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* 프로젝트 이름 */}
            <div className="grid gap-2">
              <Label htmlFor="name">프로젝트 이름</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="프로젝트 이름을 입력하세요"
                disabled={isLoading}
                required
              />
            </div>

            {/* 프로젝트 설명 */}
            <div className="grid gap-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="프로젝트에 대한 설명을 입력하세요"
                disabled={isLoading}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* 시작일 및 종료일 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">시작일</Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen} modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      id="startDate"
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP', { locale: ko }) : '시작일 선택'}
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
                    <Calendar mode="single" selected={startDate} onSelect={handleStartDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">종료일</Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen} modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
                      type="button"
                      variant="outline"
                      className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP', { locale: ko }) : '종료일 선택'}
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
                      selected={endDate}
                      onSelect={handleEndDateSelect}
                      initialFocus
                      disabled={(date) => (startDate ? date < startDate : false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

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
              {isLoading ? '수정 중...' : '프로젝트 수정'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
