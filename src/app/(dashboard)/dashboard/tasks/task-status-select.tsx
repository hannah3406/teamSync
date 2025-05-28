'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2Icon, CircleIcon, ClockIcon } from 'lucide-react';

interface TaskStatusSelectProps {
  taskId: string;
  currentStatus: string;
}

export default function TaskStatusSelect({ taskId, currentStatus }: TaskStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/task/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      setStatus(newStatus);
      router.refresh();
    } catch (error) {
      console.error('Error updating task status:', error);
      // 실패 시 원래 상태로 되돌리기
      setStatus(status);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'done':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle2Icon className="h-4 w-4 text-green-500" />
            <span>완료</span>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-blue-500" />
            <span>진행 중</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <CircleIcon className="h-4 w-4 text-gray-400" />
            <span>할 일</span>
          </div>
        );
    }
  };

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
      <SelectTrigger className="w-full">
        <SelectValue>{getStatusDisplay(status)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todo">
          <div className="flex items-center gap-2">
            <CircleIcon className="h-4 w-4 text-gray-400" />
            <span>할 일</span>
          </div>
        </SelectItem>
        <SelectItem value="in_progress">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-blue-500" />
            <span>진행 중</span>
          </div>
        </SelectItem>
        <SelectItem value="done">
          <div className="flex items-center gap-2">
            <CheckCircle2Icon className="h-4 w-4 text-green-500" />
            <span>완료</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
