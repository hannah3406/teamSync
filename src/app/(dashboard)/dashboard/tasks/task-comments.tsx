// src/app/(dashboard)/dashboard/tasks/task-comments.tsx
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
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
}

interface TaskCommentsProps {
  taskId: string;
  initialComments: Comment[];
  onCommentCountChange?: (delta: number) => void;
}

export default function TaskComments({ taskId, initialComments, onCommentCountChange }: TaskCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleCommentAdded = (newComment: Comment) => {
    // 새 댓글을 목록 맨 앞에 추가
    setComments([newComment, ...comments]);
    // 댓글 개수 증가 알림
    if (onCommentCountChange) {
      onCommentCountChange(1);
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
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 comment-item">
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
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
