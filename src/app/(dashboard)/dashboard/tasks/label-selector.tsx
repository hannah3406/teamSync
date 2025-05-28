'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TagIcon, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Label {
  id: string;
  name: string;
  color: string;
  projectId: string;
}

interface LabelSelectorProps {
  projectId: string;
  selectedLabels: string[];
  onChange: (labelIds: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function LabelSelector({
  projectId,
  selectedLabels,
  onChange,
  disabled = false,
  placeholder = '라벨 선택',
}: LabelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);

  // 프로젝트의 라벨 목록 불러오기
  const fetchLabels = async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/project/${projectId}/label`);
      if (response.ok) {
        const data = await response.json();
        setLabels(data);
      }
    } catch (error) {
      console.error('Error fetching labels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, [projectId]);

  // 라벨 선택/해제 토글
  const toggleLabel = (labelId: string) => {
    const newSelection = selectedLabels.includes(labelId)
      ? selectedLabels.filter((id) => id !== labelId)
      : [...selectedLabels, labelId];
    onChange(newSelection);
  };

  // 선택된 라벨 제거
  const removeLabel = (labelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedLabels.filter((id) => id !== labelId));
  };

  // 선택된 라벨 객체들
  const selectedLabelObjects = labels.filter((label) => selectedLabels.includes(label.id));

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="라벨 선택"
            disabled={disabled || loading}
            className={cn('w-full justify-between font-normal', selectedLabels.length === 0 && 'text-muted-foreground')}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <TagIcon className="h-4 w-4 shrink-0" />
              {selectedLabels.length === 0 ? (
                <span>{placeholder}</span>
              ) : (
                <div className="flex flex-wrap gap-1 items-center">
                  {selectedLabelObjects.slice(0, 3).map((label) => (
                    <Badge
                      key={label.id}
                      className="px-2 py-0.5 text-xs"
                      style={{
                        backgroundColor: `${label.color}20`,
                        borderColor: label.color,
                        color: label.color,
                      }}
                      variant="outline"
                    >
                      {label.name}
                    </Badge>
                  ))}
                  {selectedLabels.length > 3 && (
                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                      +{selectedLabels.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start" sideOffset={4} style={{ zIndex: 9999 }}>
          <div className="p-2 border-b">
            <p className="text-sm font-medium">라벨 선택</p>
            <p className="text-xs text-muted-foreground mt-1">{selectedLabels.length}개 선택됨</p>
          </div>
          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">라벨을 불러오는 중...</div>
            ) : labels.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">아직 라벨이 없습니다.</p>
                <p className="text-xs text-muted-foreground">프로젝트 설정에서 라벨을 추가하세요.</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {labels.map((label) => {
                  const isSelected = selectedLabels.includes(label.id);
                  return (
                    <div
                      key={label.id}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer transition-colors',
                        isSelected ? 'bg-muted' : 'hover:bg-muted/50'
                      )}
                      onClick={() => toggleLabel(label.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleLabel(label.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: label.color }} />
                        <span className="text-sm">{label.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
          {selectedLabels.length > 0 && (
            <div className="p-2 border-t">
              <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => onChange([])}>
                선택 해제
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* 선택된 라벨 목록 (폼 아래에 표시) */}
      {selectedLabelObjects.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedLabelObjects.map((label) => (
            <Badge
              key={label.id}
              className="flex items-center gap-1 px-2 py-1"
              style={{
                backgroundColor: `${label.color}20`,
                borderColor: label.color,
                color: label.color,
              }}
              variant="outline"
            >
              {label.name}
              <X className="h-3 w-3 cursor-pointer hover:opacity-70" onClick={(e) => removeLabel(label.id, e)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
