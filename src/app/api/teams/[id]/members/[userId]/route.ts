import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// 팀 멤버 역할 수정
export async function PUT(
  request: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const teamId = params.id;
    const targetUserId = params.userId;
    const currentUserId = session.user.id;
    const body = await request.json();
    const { role } = body;

    if (!role || !["member", "admin", "owner"].includes(role)) {
      return NextResponse.json(
        { error: "유효하지 않은 역할입니다." },
        { status: 400 }
      );
    }

    // 현재 사용자가 팀 소유자 또는 관리자인지 확인
    const currentUserMember = await prisma.teamMember.findFirst({
      where: {
        teamId: teamId,
        userId: currentUserId,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!currentUserMember) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // 대상 멤버 존재 확인
    const targetMember = await prisma.teamMember.findFirst({
      where: {
        teamId: teamId,
        userId: targetUserId,
      },
    });

    if (!targetMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // 소유자 역할 변경 시 추가 검증
    if (role === "owner") {
      if (currentUserMember.role !== "owner") {
        return NextResponse.json(
          { error: "소유자만 다른 멤버를 소유자로 변경할 수 있습니다." },
          { status: 403 }
        );
      }

      // 기존 소유자를 관리자로 변경
      await prisma.teamMember.updateMany({
        where: {
          teamId: teamId,
          role: "owner",
        },
        data: {
          role: "admin",
        },
      });

      // 팀의 소유자도 변경
      await prisma.team.update({
        where: { id: teamId },
        data: { ownerId: targetUserId },
      });
    }

    // 멤버 역할 업데이트
    const updatedMember = await prisma.teamMember.update({
      where: {
        id: targetMember.id,
      },
      data: {
        role: role,
      },
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
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("Error updating team member role:", error);
    return NextResponse.json(
      { error: "Failed to update team member role" },
      { status: 500 }
    );
  }
}

// 팀 멤버 제거
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const teamId = params.id;
    const targetUserId = params.userId;
    const currentUserId = session.user.id;

    // 현재 사용자가 팀 소유자 또는 관리자인지, 또는 자기 자신을 제거하는지 확인
    const currentUserMember = await prisma.teamMember.findFirst({
      where: {
        teamId: teamId,
        userId: currentUserId,
      },
    });

    const targetMember = await prisma.teamMember.findFirst({
      where: {
        teamId: teamId,
        userId: targetUserId,
      },
    });

    if (!currentUserMember || !targetMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // 권한 확인
    const canRemove =
      currentUserMember.role === "owner" || // 소유자는 모든 멤버 제거 가능
      (currentUserMember.role === "admin" && targetMember.role === "member") || // 관리자는 일반 멤버만 제거 가능
      currentUserId === targetUserId; // 자기 자신은 제거 가능

    if (!canRemove) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // 소유자는 자신을 제거할 수 없음 (팀이 소유자 없이 남게 되는 것을 방지)
    if (targetMember.role === "owner" && currentUserId === targetUserId) {
      return NextResponse.json(
        {
          error:
            "소유자는 팀을 떠날 수 없습니다. 먼저 다른 멤버에게 소유권을 이전해주세요.",
        },
        { status: 400 }
      );
    }

    // 팀 멤버 제거
    await prisma.teamMember.delete({
      where: {
        id: targetMember.id,
      },
    });

    return NextResponse.json({ message: "Team member removed successfully" });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      { error: "Failed to remove team member" },
      { status: 500 }
    );
  }
}
