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

import { AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function NewProjectDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name.trim()) {
      setError('프로젝트 이름을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '프로젝트 생성 중 오류가 발생했습니다.');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const project = await response.json();

      // 대화 상자 닫고 상태 초기화
      setOpen(false);
      setName('');
      setDescription('');

      // 페이지 새로고침하여 새 프로젝트 표시
      router.refresh();

      // 새 프로젝트의 상세 페이지로 이동 (선택적)
      // router.push(`/dashboard/projects/${project.id}`);
    } catch (error) {
      console.error('Project creation error:', error);
      setError(error instanceof Error ? error.message : '프로젝트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>새 프로젝트 생성</DialogTitle>
            <DialogDescription>
              새 프로젝트의 정보를 입력하세요. 생성 후에도 모든 정보를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">프로젝트 이름</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="새 프로젝트"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">설명 (선택)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="프로젝트에 대한 간략한 설명을 입력하세요"
                disabled={isLoading}
                className="resize-none"
                rows={3}
              />
            </div>

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
              {isLoading ? '생성 중...' : '프로젝트 생성'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
