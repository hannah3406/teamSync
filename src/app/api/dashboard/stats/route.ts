import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

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

      // 마감 임박 태스크 (7일 이내)
      prisma.task.findMany({
        where: {
          OR: [{ assigneeId: userId }, { projectId: { in: projectIds } }],
          dueDate: {
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

    const response = {
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

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
