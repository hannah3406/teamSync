import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// 팀 멤버 목록 조회
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
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: teamId,
        userId: userId,
      },
    });

    if (!teamMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 팀 멤버 목록 조회
    const members = await prisma.teamMember.findMany({
      where: {
        teamId: teamId,
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
      orderBy: [
        { role: "asc" }, // owner -> admin -> member 순서
        { joinedAt: "asc" },
      ],
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// 팀에 새 멤버 초대
export async function POST(
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
    const { email, role = "member" } = body;

    if (!email) {
      return NextResponse.json(
        { error: "이메일을 입력해주세요." },
        { status: 400 }
      );
    }

    // 팀 소유자 또는 관리자인지 확인
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: teamId,
        userId: userId,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // 초대할 사용자 찾기
    const invitedUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!invitedUser) {
      return NextResponse.json(
        { error: "해당 이메일의 사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 이미 팀 멤버인지 확인
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId: teamId,
        userId: invitedUser.id,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "이미 팀 멤버입니다." },
        { status: 400 }
      );
    }

    // 팀 멤버로 추가
    const newMember = await prisma.teamMember.create({
      data: {
        teamId: teamId,
        userId: invitedUser.id,
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

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json(
      { error: "Failed to add team member" },
      { status: 500 }
    );
  }
}
