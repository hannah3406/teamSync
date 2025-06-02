import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MyTasksWidgetProps {
  data: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    overdue: number;
  };
}

export function MyTasksWidget({ data }: MyTasksWidgetProps) {
  const { total, todo, inProgress, done, overdue } = data;

  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>내 태스크 현황</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>완료 진행률</span>
            <span>{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">할 일</span>
              <span className="font-medium">{todo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">진행 중</span>
              <span className="font-medium">{inProgress}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">완료</span>
              <span className="font-medium text-green-600">{done}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">지연</span>
              <span className="font-medium text-red-600">{overdue}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
