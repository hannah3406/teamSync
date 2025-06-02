import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  dueDate: Date | null;
  priority: string;
  project: {
    id: string;
    name: string;
  };
  assignee: {
    id: string;
    name: string | null;
    image?: string | null;
  } | null;
}

interface UpcomingDeadlinesProps {
  tasks: Task[];
}

export function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "secondary";
      case "medium":
        return "outline";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const validTasks = tasks.filter((task) => task.dueDate !== null);

  if (validTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            마감 임박 태스크
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            7일 이내 마감 예정인 태스크가 없습니다
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          마감 임박 태스크
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {validTasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <Badge
                    variant={getPriorityColor(task.priority)}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {task.project.name}
                  </p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-red-600">
                    {task.dueDate &&
                      formatDistanceToNow(new Date(task.dueDate), {
                        addSuffix: true,
                        locale: ko,
                      })}
                  </p>
                </div>
              </div>
              {task.assignee && (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.image || undefined} />
                  <AvatarFallback className="text-xs">
                    {task.assignee.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
