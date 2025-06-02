import { FolderOpen, CheckSquare, BarChart3, Clock } from "lucide-react";
import { StatCard } from "./stat-card";

interface OverviewStatsProps {
  data: {
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
  };
}

export function OverviewStats({ data }: OverviewStatsProps) {
  const { totalProjects, totalTasks, completedTasks, completionRate } = data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="전체 프로젝트"
        value={totalProjects}
        description="참여 중인 프로젝트"
        icon={FolderOpen}
      />
      <StatCard
        title="전체 태스크"
        value={totalTasks}
        description="모든 프로젝트의 태스크"
        icon={CheckSquare}
      />
      <StatCard
        title="완료된 태스크"
        value={completedTasks}
        description={`전체 태스크 중 ${completionRate}% 완료`}
        icon={BarChart3}
      />
      <StatCard
        title="완료율"
        value={`${completionRate}%`}
        description="전체 태스크 완료 비율"
        icon={Clock}
      />
    </div>
  );
}
