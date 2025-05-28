'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Comment {
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
}

export default function TaskComments({ initialComments }: TaskCommentsProps) {
  // 현재는 댓글 표시만 구현
  // TODO: 댓글 작성, 수정, 삭제 기능 추가

  if (initialComments.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">아직 댓글이 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {initialComments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.image || ''} alt={comment.author.name || ''} />
            <AvatarFallback>{comment.author.name?.charAt(0) || comment.author.email?.charAt(0) || '?'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.author.name || comment.author.email}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
