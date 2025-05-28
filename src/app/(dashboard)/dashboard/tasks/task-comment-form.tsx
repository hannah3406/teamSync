'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';

import { Comment } from './task-comments';

interface TaskCommentFormProps {
  taskId: string;
  onCommentAdded?: (comment: Comment) => void;
}

export default function TaskCommentForm({ taskId, onCommentAdded }: TaskCommentFormProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 확장 시 텍스트 영역에 포커스
  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  // 폼 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        // 내용이 없을 때만 축소
        if (!content.trim() && isExpanded) {
          setIsExpanded(false);
          setError(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [content, isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/task/${taskId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '댓글 작성 중 오류가 발생했습니다.');
      }

      const newComment = await response.json();

      // 댓글 작성 성공
      setContent('');
      setIsExpanded(false);

      // 부모 컴포넌트에 알림
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }

      // 전체 페이지 새로고침 (태스크 목록 등의 댓글 개수 업데이트)
      router.refresh();
    } catch (error) {
      console.error('Error creating comment:', error);
      setError(error instanceof Error ? error.message : '댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setError(null);
    setIsExpanded(false);
  };

  // 축소된 상태에서 클릭 시
  const handleCollapsedClick = () => {
    setIsExpanded(true);
  };

  // 축소된 상태 UI
  if (!isExpanded) {
    return (
      <div onClick={handleCollapsedClick} className="comment-input-collapsed">
        <span className="comment-placeholder">댓글 추가...</span>
      </div>
    );
  }

  // 확장된 상태 UI
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="comment-form-expanded">
      <div className="comment-textarea-wrapper">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className="comment-textarea"
          disabled={isSubmitting}
        />

        {error && (
          <div className="comment-error">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="comment-actions">
        <Button type="button" variant="ghost" size="sm" onClick={handleCancel} disabled={isSubmitting}>
          취소
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              작성 중...
            </>
          ) : (
            '댓글'
          )}
        </Button>
      </div>
    </form>
  );
}
