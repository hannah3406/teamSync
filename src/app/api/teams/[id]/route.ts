import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// 특정 팀 정보 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const teamId = params.id;
    const userId = session.user.id;

    // 사용자가 해당 팀의 멤버인지 확인
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
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
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            joinedAt: "asc",
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            _count: {
              select: {
                tasks: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

// 팀 정보 수정
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const teamId = params.id;
    const userId = session.user.id;
    const body = await request.json();
    const { name, description } = body;

    // 팀 소유자 또는 관리자인지 확인
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
                role: { in: ["owner", "admin"] },
              },
            },
          },
        ],
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found or insufficient permissions" },
        { status: 404 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "팀 이름을 입력해주세요." },
        { status: 400 }
      );
    }

    // 팀 정보 업데이트
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        name,
        description,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

// 팀 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const teamId = params.id;
    const userId = session.user.id;

    // 팀 소유자인지 확인
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        ownerId: userId,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found or insufficient permissions" },
        { status: 404 }
      );
    }

    // 팀 삭제 (연관된 데이터들도 함께 삭제됨 - Prisma schema의 cascade 설정에 따라)
    await prisma.team.delete({
      where: { id: teamId },
    });

    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
