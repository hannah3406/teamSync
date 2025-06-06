import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { MyTasksWidget } from "@/components/dashboard/my-tasks-widget";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";

export const metadata: Metadata = {
  title: "대시보드 | TeamSync",
  description: "TeamSync 대시보드",
};

async function getDashboardData(userId: string) {
  try {
    // 사용자가 속한 프로젝트 ID들 조회
    const userProjects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      select: { id: true },
    });

    const projectIds = userProjects.map((p) => p.id);

    // 병렬로 통계 데이터 조회
    const [
      totalProjects,
      totalTasks,
      completedTasks,
      myTasks,
      recentActivities,
      upcomingDeadlines,
    ] = await Promise.all([
      // 전체 프로젝트 수
      prisma.project.count({
        where: {
          OR: [
            { ownerId: userId },
            {
              members: {
                some: { userId: userId },
              },
            },
          ],
        },
      }),

      // 전체 태스크 수
      prisma.task.count({
        where: {
          projectId: { in: projectIds },
        },
      }),

      // 완료된 태스크 수
      prisma.task.count({
        where: {
          projectId: { in: projectIds },
          status: "done",
        },
      }),

      // 내 태스크 현황
      prisma.task.groupBy({
        by: ["status"],
        where: {
          assigneeId: userId,
        },
        _count: {
          status: true,
        },
      }),

      // 최근 활동 (7일 이내)
      prisma.userActivity.findMany({
        where: {
          userId: userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),

      // 마감 임박 태스크 (7일 이내) - dueDate가 null이 아닌 것만
      prisma.task.findMany({
        where: {
          OR: [{ assigneeId: userId }, { projectId: { in: projectIds } }],
          dueDate: {
            not: null, // null이 아닌 것만
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          status: { not: "done" },
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          dueDate: "asc",
        },
        take: 5,
      }),
    ]);

    // 내 태스크 현황 데이터 정리
    const myTasksStats = {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      overdue: 0,
    };

    myTasks.forEach((group) => {
      const count = group._count.status;
      myTasksStats.total += count;

      switch (group.status) {
        case "todo":
          myTasksStats.todo = count;
          break;
        case "in_progress":
          myTasksStats.inProgress = count;
          break;
        case "done":
          myTasksStats.done = count;
          break;
      }
    });

    // 마감 지난 내 태스크 수
    const overdueTasks = await prisma.task.count({
      where: {
        assigneeId: userId,
        dueDate: {
          lt: new Date(),
        },
        status: { not: "done" },
      },
    });

    myTasksStats.overdue = overdueTasks;

    // 완료율 계산
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      overview: {
        totalProjects,
        totalTasks,
        completedTasks,
        completionRate,
      },
      myTasks: myTasksStats,
      recentActivities,
      upcomingDeadlines,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  try {
    const data = await getDashboardData(session.user.id);

    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
        </div>

        {/* 전체 통계 */}
        <OverviewStats data={data.overview} />

        {/* 상세 위젯들 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MyTasksWidget data={data.myTasks} />
          <RecentActivities activities={data.recentActivities} />
          <UpcomingDeadlines
            tasks={data.upcomingDeadlines.filter((task) => task.dueDate)}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);

    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
        </div>
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    );
  }
}
