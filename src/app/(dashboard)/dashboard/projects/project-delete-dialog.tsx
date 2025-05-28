'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface ProjectDeleteDialogProps {
  children: React.ReactNode;
  projectId: string;
  projectName: string;
}

export default function ProjectDeleteDialog({ children, projectId, projectName }: ProjectDeleteDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/project/${projectId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '프로젝트 삭제 중 오류가 발생했습니다.');
      }

      // 삭제 성공 - 프로젝트 목록으로 이동
      router.push('/dashboard/projects');
      router.refresh();
    } catch (error) {
      console.error('Error deleting project:', error);
      setError(error instanceof Error ? error.message : '프로젝트 삭제 중 오류가 발생했습니다.');
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            프로젝트 삭제
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium">&quot;{projectName}&quot;</span> 프로젝트를 정말 삭제하시겠습니까?
            <br />
            <br />
            {error ? (
              <span className="text-destructive">{error}</span>
            ) : (
              <>
                <strong className="text-destructive">주의:</strong> 이 작업은 취소할 수 없습니다.
                <br />
                프로젝트를 삭제하기 전에 모든 태스크와 문서를 먼저 삭제해야 합니다.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
