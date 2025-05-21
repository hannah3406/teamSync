import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// 간단한 비밀번호 해싱 함수 (실제 프로덕션에서는 bcrypt 등 사용 권장)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('MONGODB_URI 환경 변수:', process.env.MONGODB_URI);
  console.log('데이터베이스 시드 시작...');

  // 관리자 사용자 생성
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '관리자',
      role: 'admin',
      password: hashPassword('password'),
    },
  });
  console.log(`관리자 사용자 생성됨: ${admin.name} (${admin.email})`);

  // 일반 사용자 생성
  const user1 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: '테스트 사용자',
      role: 'user',
      password: hashPassword('password'),
    },
  });
  console.log(`일반 사용자 생성됨: ${user1.name} (${user1.email})`);

  // 추가 사용자 생성
  const user2 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: '홍길동',
      role: 'user',
      password: hashPassword('password'),
      bio: '프론트엔드 개발자입니다.',
    },
  });
  console.log(`일반 사용자 생성됨: ${user2.name} (${user2.email})`);

  const user3 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: '김철수',
      role: 'user',
      password: hashPassword('password'),
      bio: '백엔드 개발자입니다.',
    },
  });
  console.log(`일반 사용자 생성됨: ${user3.name} (${user3.email})`);

  // 팀 생성
  const team = await prisma.team.create({
    data: {
      name: '개발팀',
      description: '소프트웨어 개발 프로젝트를 담당하는 팀입니다.',
      ownerId: admin.id,
      members: {
        create: [
          {
            role: 'owner',
            userId: admin.id,
          },
          {
            role: 'member',
            userId: user1.id,
          },
          {
            role: 'admin',
            userId: user2.id,
          },
          {
            role: 'member',
            userId: user3.id,
          },
        ],
      },
    },
  });
  console.log(`팀 생성됨: ${team.name}`);

  // 프로젝트 1 생성
  const project1 = await prisma.project.create({
    data: {
      name: 'TeamSync 개발',
      description: '협업 도구 개발 프로젝트',
      ownerId: admin.id,
      teamId: team.id,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      members: {
        create: [
          {
            role: 'owner',
            userId: admin.id,
          },
          {
            role: 'member',
            userId: user1.id,
          },
          {
            role: 'member',
            userId: user2.id,
          },
          {
            role: 'member',
            userId: user3.id,
          },
        ],
      },
    },
  });
  console.log(`프로젝트 생성됨: ${project1.name}`);

  // 프로젝트 2 생성
  const project2 = await prisma.project.create({
    data: {
      name: '마케팅 웹사이트',
      description: '회사 마케팅용 웹사이트 개발',
      ownerId: user2.id,
      teamId: team.id,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      members: {
        create: [
          {
            role: 'owner',
            userId: user2.id,
          },
          {
            role: 'member',
            userId: user3.id,
          },
        ],
      },
    },
  });
  console.log(`프로젝트 생성됨: ${project2.name}`);

  // 라벨 생성
  const labels = await Promise.all([
    prisma.label.create({
      data: {
        name: '프론트엔드',
        color: '#3498db', // 파란색
        projectId: project1.id,
      },
    }),
    prisma.label.create({
      data: {
        name: '백엔드',
        color: '#2ecc71', // 녹색
        projectId: project1.id,
      },
    }),
    prisma.label.create({
      data: {
        name: '버그',
        color: '#e74c3c', // 빨간색
        projectId: project1.id,
      },
    }),
    prisma.label.create({
      data: {
        name: '문서화',
        color: '#f39c12', // 주황색
        projectId: project1.id,
      },
    }),
    prisma.label.create({
      data: {
        name: '디자인',
        color: '#9b59b6', // 보라색
        projectId: project2.id,
      },
    }),
    prisma.label.create({
      data: {
        name: '콘텐츠',
        color: '#1abc9c', // 청록색
        projectId: project2.id,
      },
    }),
  ]);
  console.log(`${labels.length}개의 라벨 생성됨`);

  // 마일스톤 생성
  const milestone1 = await prisma.milestone.create({
    data: {
      title: 'MVP 버전 출시',
      description: '첫 번째 MVP 버전 릴리스',
      startDate: new Date(),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      projectId: project1.id,
    },
  });

  const milestone2 = await prisma.milestone.create({
    data: {
      title: '베타 버전 출시',
      description: '베타 테스트 준비',
      startDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      projectId: project1.id,
    },
  });

  console.log(`마일스톤 생성됨: ${milestone1.title}, ${milestone2.title}`);

  // 프로젝트 1의 태스크 생성
  const project1Tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: '로그인 페이지 구현',
        description: '사용자 인증 기능이 포함된 로그인 페이지 개발',
        status: 'in_progress',
        priority: 'high',
        projectId: project1.id,
        assigneeId: user2.id,
        milestoneId: milestone1.id,
        position: 0,
        labels: {
          create: [
            {
              labelId: labels[0].id, // 프론트엔드
            },
          ],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: '회원가입 페이지 구현',
        description: '이메일 인증이 포함된 회원가입 페이지 개발',
        status: 'todo',
        priority: 'medium',
        projectId: project1.id,
        assigneeId: user2.id,
        milestoneId: milestone1.id,
        position: 1,
        labels: {
          create: [
            {
              labelId: labels[0].id, // 프론트엔드
            },
          ],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: '인증 API 개발',
        description: '사용자 인증 및 권한 관리를 위한 백엔드 API 개발',
        status: 'done',
        priority: 'high',
        projectId: project1.id,
        assigneeId: user3.id,
        milestoneId: milestone1.id,
        position: 2,
        labels: {
          create: [
            {
              labelId: labels[1].id, // 백엔드
            },
          ],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: '프로젝트 관리 페이지 구현',
        description: '프로젝트 CRUD 기능이 포함된 관리 페이지 개발',
        status: 'todo',
        priority: 'high',
        projectId: project1.id,
        assigneeId: user2.id,
        milestoneId: milestone1.id,
        position: 3,
        labels: {
          create: [
            {
              labelId: labels[0].id, // 프론트엔드
            },
          ],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: '프로젝트 API 개발',
        description: '프로젝트 관리를 위한 백엔드 API 개발',
        status: 'todo',
        priority: 'high',
        projectId: project1.id,
        assigneeId: user3.id,
        milestoneId: milestone1.id,
        position: 4,
        labels: {
          create: [
            {
              labelId: labels[1].id, // 백엔드
            },
          ],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: '태스크 드래그 앤 드롭 기능 구현',
        description: '칸반 보드에서 태스크를 드래그 앤 드롭으로 이동할 수 있는 기능 개발',
        status: 'todo',
        priority: 'medium',
        projectId: project1.id,
        assigneeId: user2.id,
        milestoneId: milestone2.id,
        position: 5,
        labels: {
          create: [
            {
              labelId: labels[0].id, // 프론트엔드
            },
          ],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: '실시간 알림 기능 구현',
        description: '웹소켓을 사용한 실시간 알림 기능 개발',
        status: 'todo',
        priority: 'low',
        projectId: project1.id,
        assigneeId: user3.id,
        milestoneId: milestone2.id,
        position: 6,
        labels: {
          create: [
            {
              labelId: labels[1].id, // 백엔드
            },
          ],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: '사용자 대시보드 UI 개선',
        description: '대시보드 디자인 및 사용자 경험 개선',
        status: 'todo',
        priority: 'low',
        projectId: project1.id,
        assigneeId: user2.id,
        milestoneId: milestone2.id,
        position: 7,
        labels: {
          create: [
            {
              labelId: labels[0].id, // 프론트엔드
            },
          ],
        },
      },
    }),
  ]);
  console.log(`프로젝트 1에 ${project1Tasks.length}개의 태스크 생성됨`);

  // 프로젝트 2의 태스크 생성
  const project2Tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: '웹사이트 디자인 시안 제작',
        description: '마케팅 웹사이트의 디자인 시안 제작',
        status: 'in_progress',
        priority: 'high',
        projectId: project2.id,
        assigneeId: user2.id,
        position: 0,
        labels: {
          create: [
            {
              labelId: labels[4].id, // 디자인
            },
          ],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: '회사 소개 페이지 콘텐츠 작성',
        description: '회사 소개 페이지에 들어갈 텍스트 콘텐츠 작성',
        status: 'todo',
        priority: 'medium',
        projectId: project2.id,
        assigneeId: user3.id,
        position: 1,
        labels: {
          create: [
            {
              labelId: labels[5].id, // 콘텐츠
            },
          ],
        },
      },
    }),
    prisma.task.create({
      data: {
        title: '제품 소개 페이지 구현',
        description: '제품 소개 페이지 디자인 및 구현',
        status: 'todo',
        priority: 'medium',
        projectId: project2.id,
        assigneeId: user2.id,
        position: 2,
        labels: {
          create: [
            {
              labelId: labels[4].id, // 디자인
            },
          ],
        },
      },
    }),
  ]);
  console.log(`프로젝트 2에 ${project2Tasks.length}개의 태스크 생성됨`);

  // 댓글 생성
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: '로그인 페이지 디자인이 완료되었습니다. 검토 부탁드립니다.',
        authorId: user2.id,
        taskId: project1Tasks[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: '검토 완료했습니다. API 연동 작업 진행해주세요.',
        authorId: admin.id,
        taskId: project1Tasks[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'API 문서 어디서 확인할 수 있나요?',
        authorId: user2.id,
        taskId: project1Tasks[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: '인증 API 개발이 완료되었습니다. 문서는 노션에 업로드했습니다.',
        authorId: user3.id,
        taskId: project1Tasks[2].id,
      },
    }),
  ]);
  console.log(`${comments.length}개의 댓글 생성됨`);

  // 사용자 활동 생성
  const activities = await Promise.all([
    prisma.userActivity.create({
      data: {
        action: 'created',
        entityType: 'project',
        entityId: project1.id,
        details: { projectName: project1.name },
        userId: admin.id,
      },
    }),
    prisma.userActivity.create({
      data: {
        action: 'created',
        entityType: 'task',
        entityId: project1Tasks[0].id,
        details: { taskTitle: project1Tasks[0].title, projectId: project1.id },
        userId: admin.id,
      },
    }),
    prisma.userActivity.create({
      data: {
        action: 'updated',
        entityType: 'task',
        entityId: project1Tasks[2].id,
        details: { taskTitle: project1Tasks[2].title, status: 'done', previousStatus: 'in_progress' },
        userId: user3.id,
      },
    }),
    prisma.userActivity.create({
      data: {
        action: 'commented',
        entityType: 'task',
        entityId: project1Tasks[0].id,
        details: { taskTitle: project1Tasks[0].title, commentId: comments[0].id },
        userId: user2.id,
      },
    }),
  ]);
  console.log(`${activities.length}개의 사용자 활동 생성됨`);

  // 알림 생성
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        type: 'mention',
        message: '홍길동님이 태스크 "로그인 페이지 구현"에서 회원님을 언급했습니다.',
        entityType: 'task',
        entityId: project1Tasks[0].id,
        userId: admin.id,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'assignment',
        message: '새로운 태스크 "인증 API 개발"이 할당되었습니다.',
        entityType: 'task',
        entityId: project1Tasks[2].id,
        userId: user3.id,
      },
    }),
    prisma.notification.create({
      data: {
        type: 'comment',
        message: '관리자님이 태스크 "로그인 페이지 구현"에 댓글을 남겼습니다.',
        entityType: 'task',
        entityId: project1Tasks[0].id,
        userId: user2.id,
      },
    }),
  ]);
  console.log(`${notifications.length}개의 알림 생성됨`);

  // 문서 생성
  const documents = await Promise.all([
    prisma.document.create({
      data: {
        title: 'TeamSync 프로젝트 개요',
        content:
          '# TeamSync 프로젝트\n\n## 소개\nTeamSync는 팀 협업을 위한 올인원 솔루션입니다.\n\n## 주요 기능\n- 태스크 관리\n- 실시간 협업\n- 프로젝트 관리\n- 문서 관리\n- 팀 관리',
        type: 'wiki',
        ownerId: admin.id,
        projectId: project1.id,
      },
    }),
    prisma.document.create({
      data: {
        title: '개발 환경 설정 가이드',
        content:
          '# 개발 환경 설정 가이드\n\n## 필요 소프트웨어\n- Node.js 18 이상\n- MongoDB\n- Visual Studio Code\n\n## 설치 및 설정\n1. 리포지토리 클론\n2. 의존성 설치\n3. 환경 변수 설정\n4. 개발 서버 실행',
        type: 'note',
        ownerId: admin.id,
        projectId: project1.id,
      },
    }),
    prisma.document.create({
      data: {
        title: '디자인 가이드라인',
        content:
          '# 디자인 가이드라인\n\n## 색상\n- 주요 색상: #3498db\n- 보조 색상: #2ecc71\n- 강조 색상: #e74c3c\n\n## 폰트\n- 제목: Geist Sans\n- 본문: Geist Sans\n- 코드: Geist Mono',
        type: 'wiki',
        ownerId: user2.id,
        projectId: project1.id,
      },
    }),
    prisma.document.create({
      data: {
        title: '회의록: 킥오프 미팅',
        content:
          '# 킥오프 미팅 회의록\n\n**날짜**: 2025-05-15\n**참석자**: 관리자, 홍길동, 김철수\n\n## 논의 사항\n1. 프로젝트 목표 설정\n2. 역할 분담\n3. 일정 계획\n\n## 결정 사항\n- MVP 버전 1개월 내 출시\n- 매주 월요일 10시 정기 미팅',
        type: 'meeting',
        ownerId: admin.id,
        projectId: project1.id,
      },
    }),
  ]);
  console.log(`${documents.length}개의 문서 생성됨`);

  // 문서 버전 생성
  await prisma.documentVersion.create({
    data: {
      version: 1,
      content: documents[0].content!,
      documentId: documents[0].id,
      authorId: admin.id,
    },
  });
  console.log(`문서 버전 생성됨`);

  console.log('데이터베이스 시드 완료!');
}

main()
  .catch((e) => {
    console.error('시드 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
