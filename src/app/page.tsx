import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default async function Home() {
  // 이미 로그인 된 경우 대시보드로 리다이렉트
  const session = await auth();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Team</span>
            <span className="text-xl font-bold">Sync</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">로그인</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold max-w-3xl">
              TeamSync로 협업하고, 태스크를 관리하고, 프로젝트를 추적하세요
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
              TeamSync는 팀이 체계적으로 조직되고, 효율적으로 작업을 관리하며, 프로젝트 진행 상황을 추적할 수 있도록
              도와주는 올인원 협업 도구입니다.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg">시작하기</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  더 알아보기
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="py-20 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">주요 기능</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="m9 14 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">태스크 관리</h3>
                <p className="mt-2 text-muted-foreground">
                  프로젝트를 진행하기 위한 태스크를 생성, 할당 및 추적할 수 있습니다.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">실시간 협업</h3>
                <p className="mt-2 text-muted-foreground">
                  공유 문서와 커뮤니케이션 도구로 팀원들과 실시간으로 협업할 수 있습니다.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">프로젝트 관리</h3>
                <p className="mt-2 text-muted-foreground">
                  명확한 목표, 일정 및 진행 상황 추적으로 작업을 프로젝트로 체계화할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">직관적인 인터페이스로 팀 작업 간소화</h2>
                <p className="text-lg mb-4">
                  TeamSync는 사용하기 쉬운 인터페이스를 통해 팀 작업을 간소화합니다. 드래그 앤 드롭 기능으로 태스크를
                  쉽게 재배치하고, 실시간 업데이트로 팀원들과 항상 동기화 상태를 유지할 수 있습니다.
                </p>
                <p className="text-lg mb-6">
                  태스크 생성, 할당, 상태 변경이 몇 번의 클릭만으로 가능하며, 직관적인 대시보드를 통해 프로젝트 진행
                  상황을 한눈에 파악할 수 있습니다.
                </p>
                <Link href="/features">
                  <Button>기능 자세히 보기</Button>
                </Link>
              </div>
              <div className="bg-muted rounded-lg p-4 flex items-center justify-center">
                <div className="aspect-video relative w-full max-w-md">
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary/40"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Team</span>
            <span className="text-xl font-bold">Sync</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 TeamSync. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
