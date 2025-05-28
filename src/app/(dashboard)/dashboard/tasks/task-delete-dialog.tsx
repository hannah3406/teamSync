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

interface TaskDeleteDialogProps {
  children: React.ReactNode;
  taskId: string;
  taskTitle: string;
}

export default function TaskDeleteDialog({ children, taskId, taskTitle }: TaskDeleteDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/task/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // 삭제 성공 - 태스크 목록으로 이동
      router.push('/dashboard/tasks');
      router.refresh();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('태스크 삭제 중 오류가 발생했습니다.');
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
            태스크 삭제
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium">&quot;{taskTitle}&quot;</span> 태스크를 정말 삭제하시겠습니까?
            <br />이 작업은 취소할 수 없으며, 관련된 모든 댓글과 활동 기록도 함께 삭제됩니다.
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
