'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { PlusIcon, Loader2, Trash2Icon, PencilIcon } from 'lucide-react';

// 사전 정의된 라벨 색상
const PRESET_COLORS = [
  '#e74c3c',
  '#e67e22',
  '#f39c12',
  '#2ecc71',
  '#1abc9c',
  '#3498db',
  '#9b59b6',
  '#34495e',
  '#95a5a6',
  '#d35400',
  '#c0392b',
  '#16a085',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
];

interface LabelData {
  id: string;
  name: string;
  color: string;
  _count: {
    tasks: number;
  };
}

interface LabelManagementDialogProps {
  children: React.ReactNode;
  projectId: string;
  projectName: string;
}

export default function LabelManagementDialog({ children, projectId, projectName }: LabelManagementDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState<LabelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingLabel, setEditingLabel] = useState<LabelData | null>(null);
  const [deletingLabel, setDeletingLabel] = useState<LabelData | null>(null);

  // 새 라벨 생성 폼
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState(PRESET_COLORS[0]);
  const [createError, setCreateError] = useState<string | null>(null);

  // 라벨 편집 폼
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // 라벨 목록 불러오기
  const fetchLabels = async () => {
    try {
      const response = await fetch(`/api/project/${projectId}/label`);
      if (!response.ok) throw new Error('Failed to fetch labels');
      const data = await response.json();
      setLabels(data);
    } catch (error) {
      console.error('Error fetching labels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLabels();
    }
  }, [open, projectId]);

  // 새 라벨 생성
  const handleCreateLabel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError(null);

    try {
      const response = await fetch(`/api/project/${projectId}/label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newLabelName,
          color: newLabelColor,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '라벨 생성 중 오류가 발생했습니다.');
      }

      // 라벨 목록에 추가
      setLabels([...labels, data]);

      // 폼 초기화
      setNewLabelName('');
      setNewLabelColor(PRESET_COLORS[0]);

      // 전체 페이지 새로고침 (태스크 생성/편집 폼에 반영)
      router.refresh();
    } catch (error) {
      console.error('Error creating label:', error);
      setCreateError(error instanceof Error ? error.message : '라벨 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  // 라벨 편집 시작
  const startEditLabel = (label: LabelData) => {
    setEditingLabel(label);
    setEditName(label.name);
    setEditColor(label.color);
    setEditError(null);
  };

  // 라벨 업데이트
  const handleUpdateLabel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLabel) return;

    setIsUpdating(true);
    setEditError(null);

    try {
      const response = await fetch(`/api/label/${editingLabel.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editName,
          color: editColor,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '라벨 수정 중 오류가 발생했습니다.');
      }

      // 라벨 목록 업데이트
      setLabels(labels.map((l) => (l.id === editingLabel.id ? data : l)));

      // 편집 모드 종료
      setEditingLabel(null);

      // 전체 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error('Error updating label:', error);
      setEditError(error instanceof Error ? error.message : '라벨 수정 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 라벨 삭제
  const handleDeleteLabel = async () => {
    if (!deletingLabel) return;

    try {
      const response = await fetch(`/api/label/${deletingLabel.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '라벨 삭제 중 오류가 발생했습니다.');
      }

      // 라벨 목록에서 제거
      setLabels(labels.filter((l) => l.id !== deletingLabel.id));
      setDeletingLabel(null);

      // 전체 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error('Error deleting label:', error);
      alert(error instanceof Error ? error.message : '라벨 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>라벨 관리</DialogTitle>
            <DialogDescription>
              &quot;{projectName}&quot; 프로젝트의 라벨을 관리합니다. 라벨은 태스크를 분류하고 검색하는 데 사용됩니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 새 라벨 생성 폼 */}
            <form onSubmit={handleCreateLabel} className="space-y-4">
              <h4 className="text-sm font-medium">새 라벨 만들기</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="라벨 이름"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  disabled={isCreating}
                  className="flex-1"
                />
                <div className="flex gap-1">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewLabelColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        newLabelColor === color ? 'border-gray-900 scale-125' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      disabled={isCreating}
                    />
                  ))}
                </div>
                <Button type="submit" size="sm" disabled={isCreating || !newLabelName.trim()}>
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusIcon className="h-4 w-4" />}
                </Button>
              </div>
              {createError && <p className="text-sm text-destructive">{createError}</p>}
            </form>

            {/* 라벨 목록 */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">기존 라벨</h4>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-10" />
                  ))}
                </div>
              ) : labels.length === 0 ? (
                <p className="text-sm text-muted-foreground">아직 라벨이 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {labels.map((label) => (
                    <div key={label.id}>
                      {editingLabel?.id === label.id ? (
                        // 편집 모드
                        <form onSubmit={handleUpdateLabel} className="flex gap-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            disabled={isUpdating}
                            className="flex-1"
                          />
                          <div className="flex gap-1">
                            {PRESET_COLORS.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setEditColor(color)}
                                className={`w-6 h-6 rounded-full border-2 transition-all ${
                                  editColor === color ? 'border-gray-900 scale-125' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color }}
                                disabled={isUpdating}
                              />
                            ))}
                          </div>
                          <Button type="submit" size="sm" disabled={isUpdating || !editName.trim()}>
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : '저장'}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingLabel(null)}
                            disabled={isUpdating}
                          >
                            취소
                          </Button>
                        </form>
                      ) : (
                        // 표시 모드
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: label.color }} />
                            <span className="font-medium">{label.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {label._count.tasks}개 태스크
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => startEditLabel(label)}>
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeletingLabel(label)}
                              disabled={label._count.tasks > 0}
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {editError && editingLabel?.id === label.id && (
                        <p className="text-sm text-destructive mt-1">{editError}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 대화상자 */}
      <AlertDialog open={!!deletingLabel} onOpenChange={(open) => !open && setDeletingLabel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>라벨 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deletingLabel?.name}&quot; 라벨을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLabel}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
