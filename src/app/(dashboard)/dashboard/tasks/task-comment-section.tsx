// src/app/(dashboard)/dashboard/tasks/task-comment-section.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MessageSquareIcon } from 'lucide-react';
import TaskComments from './task-comments';

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

interface TaskCommentSectionProps {
  taskId: string;
  initialComments: Comment[];
  initialCount: number;
  currentUserId?: string;
}

export default function TaskCommentSection({
  taskId,
  initialComments,
  initialCount,
  currentUserId,
}: TaskCommentSectionProps) {
  const [commentCount, setCommentCount] = useState(initialCount);

  const handleCommentCountChange = (delta: number) => {
    setCommentCount((prev) => prev + delta);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <MessageSquareIcon className="h-5 w-5" />
          댓글 ({commentCount})
        </h3>
      </CardHeader>
      <CardContent>
        <TaskComments
          taskId={taskId}
          initialComments={initialComments}
          currentUserId={currentUserId}
          onCommentCountChange={handleCommentCountChange}
        />
      </CardContent>
    </Card>
  );
}
