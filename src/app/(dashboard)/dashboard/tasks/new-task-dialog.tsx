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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { X, CalendarIcon, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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
  labels: Label[];
}

export default function NewTaskDialog({ children, projects, labels }: NewTaskDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [labelsOpen, setLabelsOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  // 프로젝트 생성 안내 대화상자 상태
  const [showProjectPrompt, setShowProjectPrompt] = useState(false);

  const [projectLabels, setProjectLabels] = useState<Label[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 프로젝트가 없는지 확인
  const hasProjects = projects.length > 0;

  const handleOpenDialog = () => {
    if (hasProjects) {
      setOpen(true);
    } else {
      // 프로젝트 생성 안내 대화상자 열기
      setShowProjectPrompt(true);
    }
  };

  // 프로젝트 생성 페이지로 이동
  const navigateToCreateProject = () => {
    router.push('/dashboard/projects');
  };

  // 프로젝트가 변경되면 해당 프로젝트의 라벨로 필터링
  const handleProjectChange = (value: string) => {
    setProjectId(value);
    setSelectedLabels([]); // 프로젝트 변경 시 선택된 라벨 초기화

    if (value) {
      const filteredLabels = labels.filter((label) => label.projectId === value);
      setProjectLabels(filteredLabels);
    } else {
      setProjectLabels([]);
    }
  };

  // 라벨 토글
  const toggleLabel = (labelId: string) => {
    if (selectedLabels.includes(labelId)) {
      setSelectedLabels(selectedLabels.filter((id) => id !== labelId));
    } else {
      setSelectedLabels([...selectedLabels, labelId]);
    }
  };

  // 선택된 라벨 제거
  const removeLabel = (labelId: string) => {
    setSelectedLabels(selectedLabels.filter((id) => id !== labelId));
  };

  // 날짜 선택 핸들러 수정 - 이벤트 버블링 방지
  const handleDateSelect = (date: Date | undefined) => {
    setDueDate(date);
    setCalendarOpen(false); // 날짜 선택 후 달력 닫기
  };

  // Popover 내부 클릭 시 이벤트 버블링 방지
  const handlePopoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 날짜 제거 핸들러
  const handleDateClear = () => {
    setDueDate(undefined);
  };

  // 폼 제출
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

      // 성공 처리
      setOpen(false);
      resetForm();
      router.refresh(); // 페이지 새로고침하여 새 태스크 표시
    } catch (error) {
      console.error('Task creation error:', error);
      setError(error instanceof Error ? error.message : '태스크 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 초기화
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setProjectId('');
    setStatus('todo');
    setPriority('medium');
    setDueDate(undefined);
    setSelectedLabels([]);
    setProjectLabels([]);
    setError(null);
  };

  return (
    <>
      {/* 메인 태스크 생성 대화상자 */}
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) resetForm();
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

        <DialogContent className="sm:max-w-[550px]" onPointerDownOutside={(e) => e.preventDefault()}>
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

              {/* 마감일 선택 - 수정된 부분 */}
              <div className="grid gap-2">
                <Label htmlFor="dueDate">마감일 (선택)</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="dueDate"
                      variant="outline"
                      className={cn('w-full justify-start text-left font-normal', !dueDate && 'text-muted-foreground')}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, 'PPP', { locale: ko }) : '마감일 선택'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" onClick={handlePopoverClick}>
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
                {dueDate && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-auto p-0 text-xs text-muted-foreground"
                    onClick={handleDateClear}
                    disabled={isLoading}
                  >
                    <X className="mr-1 h-3 w-3" />
                    마감일 제거
                  </Button>
                )}
              </div>

              {/* 라벨 선택 */}
              {projectId && (
                <div className="grid gap-2">
                  <Label htmlFor="labels">라벨 (선택)</Label>
                  <Popover open={labelsOpen} onOpenChange={setLabelsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="labels"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={isLoading || projectLabels.length === 0}
                      >
                        라벨 선택
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start" onClick={handlePopoverClick}>
                      <Command>
                        <CommandInput placeholder="라벨 검색..." />
                        <CommandEmpty>라벨을 찾을 수 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {projectLabels.map((label) => (
                            <CommandItem key={label.id} value={label.name} onSelect={() => toggleLabel(label.id)}>
                              <div className="flex items-center gap-2 w-full">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: label.color }} />
                                <span>{label.name}</span>
                                {selectedLabels.includes(label.id) && <Check className="ml-auto h-4 w-4" />}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* 선택된 라벨 표시 */}
                  {selectedLabels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedLabels.map((labelId) => {
                        const label = projectLabels.find((l) => l.id === labelId);
                        if (!label) return null;
                        return (
                          <Badge
                            key={label.id}
                            className="flex items-center gap-1 px-2 py-1"
                            style={{
                              backgroundColor: `${label.color}20`,
                              borderColor: label.color,
                              color: label.color,
                            }}
                            variant="outline"
                          >
                            {label.name}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLabel(label.id);
                              }}
                            />
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  {projectLabels.length === 0 && projectId && (
                    <p className="text-xs text-muted-foreground">이 프로젝트에는 아직 라벨이 없습니다.</p>
                  )}
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
