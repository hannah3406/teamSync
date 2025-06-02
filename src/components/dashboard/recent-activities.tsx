import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
  details?: any;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityMessage = (activity: Activity) => {
    const { action, entityType } = activity;

    switch (`${action}_${entityType}`) {
      case "created_task":
        return "새 태스크를 생성했습니다";
      case "updated_task":
        return "태스크를 수정했습니다";
      case "completed_task":
        return "태스크를 완료했습니다";
      case "created_project":
        return "새 프로젝트를 생성했습니다";
      case "updated_project":
        return "프로젝트를 수정했습니다";
      case "created_comment":
        return "댓글을 작성했습니다";
      default:
        return `${entityType}을(를) ${action}했습니다`;
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">최근 활동이 없습니다</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{getActivityMessage(activity)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
