// src/app/(dashboard)/dashboard/tasks/task-comments.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { Trash2, Loader2 } from 'lucide-react';
import TaskCommentForm from './task-comment-form';

export interface Comment {
  id: string;
  content: string;
  createdAt: string | Date;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  authorId?: string; // Prisma에서 직접 오는 경우
}

interface TaskCommentsProps {
  taskId: string;
  initialComments: Comment[];
  currentUserId?: string;
  onCommentCountChange?: (delta: number) => void;
}

export default function TaskComments({
  taskId,
  initialComments,
  currentUserId,
  onCommentCountChange,
}: TaskCommentsProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);

  const handleCommentAdded = (newComment: Comment) => {
    // 새 댓글을 목록 맨 앞에 추가
    setComments([newComment, ...comments]);
    // 댓글 개수 증가 알림
    if (onCommentCountChange) {
      onCommentCountChange(1);
    }
  };

  const handleDeleteClick = (comment: Comment) => {
    setCommentToDelete(comment);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;

    setDeletingCommentId(commentToDelete.id);

    try {
      const response = await fetch(`/api/comment/${commentToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      // 댓글 목록에서 제거
      setComments(comments.filter((c) => c.id !== commentToDelete.id));

      // 댓글 개수 감소
      if (onCommentCountChange) {
        onCommentCountChange(-1);
      }

      // 페이지 새로고침 (다른 컴포넌트의 댓글 개수 업데이트)
      router.refresh();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingCommentId(null);
      setCommentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 댓글 작성 폼 */}
      <div>
        <TaskCommentForm taskId={taskId} onCommentAdded={handleCommentAdded} />
      </div>

      {/* 댓글이 있을 때만 구분선 표시 */}
      {comments.length > 0 && <Separator />}

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">첫 번째 댓글을 남겨보세요!</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isOwner = currentUserId === (comment.authorId || comment.author.id);
            const isDeleting = deletingCommentId === comment.id;

            return (
              <div key={comment.id} className="flex gap-3 comment-item group">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.image || ''} alt={comment.author.name || ''} />
                  <AvatarFallback>
                    {comment.author.name?.charAt(0) || comment.author.email?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.author.name || comment.author.email}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko })}
                    </span>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteClick(comment)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 삭제 확인 대화상자 */}
      <AlertDialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
            <AlertDialogDescription>이 댓글을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
