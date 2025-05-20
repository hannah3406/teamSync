import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Team</span>
            <span className="text-xl font-bold">Sync</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">로그인</Button>
            </Link>
            <Link href="/login">
              <Button>시작하기</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container">
            <h1 className="text-4xl font-bold mb-8">TeamSync에 대하여</h1>
            <div className="grid md:grid-cols-3 gap-16">
              <div className="col-span-2">
                <p className="text-lg mb-6">
                  TeamSync는 현대 팀 협업의 과제를 해결하기 위해 설계된 올인원 프로젝트 관리 및 협업 플랫폼입니다.
                  우리의 목표는 팀이 더 효율적으로 소통하고, 작업을 체계화하며, 프로젝트를 성공적으로 완료할 수 있도록
                  돕는 것입니다.
                </p>
                <p className="text-lg mb-6">
                  복잡한 이메일 체인, 흩어진 문서, 불분명한 책임 구분은 이제 과거의 일입니다. TeamSync를 통해 모든
                  팀원이 동일한 페이지에서 작업하며, 실시간 업데이트와 명확한 작업 할당으로 프로젝트 진행 상황을 항상
                  투명하게 유지할 수 있습니다.
                </p>
                <h2 className="text-2xl font-bold mt-10 mb-4">우리의 역사</h2>
                <p className="text-lg mb-6">
                  TeamSync는 2024년 초 개발자 팀에 의해 탄생했습니다. 그들은 여러 협업 도구를 사용하면서 하나의 통합된
                  솔루션에 대한 필요성을 느꼈고, 이것이 TeamSync의 시작이 되었습니다.
                </p>
                <p className="text-lg mb-6">
                  수개월의 개발과 테스트를 거쳐, 우리는 타겟 사용자의 피드백을 지속적으로 반영하며 TeamSync를
                  발전시켜왔습니다. 현재 TeamSync는 다양한 규모의 팀에게 최적화된 협업 솔루션을 제공하고 있습니다.
                </p>
              </div>
              <div>
                <div className="bg-muted rounded-lg p-6 sticky top-10">
                  <h3 className="text-xl font-bold mb-4">주요 기능</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>직관적인 태스크 관리</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>실시간 협업 에디터</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>프로젝트 타임라인 및 마일스톤</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>팀 커뮤니케이션 허브</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>데이터 시각화 및 보고서</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>파일 공유 및 버전 관리</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/login">
                      <Button className="w-full">지금 시작하기</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">TeamSync가 특별한 이유</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
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
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m6 12 4 4 8-8"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">올인원 솔루션</h3>
                <p className="text-muted-foreground">
                  여러 도구 간 전환할 필요 없이 하나의 플랫폼에서 모든 작업을 처리할 수 있습니다.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
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
                  >
                    <path d="M2 20h.01"></path>
                    <path d="M7 20v-4"></path>
                    <path d="M12 20v-8"></path>
                    <path d="M17 20V8"></path>
                    <path d="M22 4v16"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">실시간 협업</h3>
                <p className="text-muted-foreground">
                  팀원들과 동시에 문서 작업을 하고, 실시간으로 변경 사항을 확인할 수 있습니다.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
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
                  >
                    <path d="M12 2v4"></path>
                    <path d="M12 18v4"></path>
                    <path d="M4.93 4.93l2.83 2.83"></path>
                    <path d="M16.24 16.24l2.83 2.83"></path>
                    <path d="M2 12h4"></path>
                    <path d="M18 12h4"></path>
                    <path d="M4.93 19.07l2.83-2.83"></path>
                    <path d="M16.24 7.76l2.83-2.83"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">쉬운 확장성</h3>
                <p className="text-muted-foreground">
                  소규모 팀에서 대규모 조직까지, TeamSync는 모든 규모에 맞게 확장될 수 있습니다.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
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
                  >
                    <rect x="12" y="2" width="8" height="20" rx="2"></rect>
                    <rect x="4" y="6" width="8" height="16" rx="2"></rect>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">직관적인 사용자 경험</h3>
                <p className="text-muted-foreground">
                  복잡한 설정 없이도 누구나 쉽게 사용할 수 있는 직관적인 인터페이스를 제공합니다.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
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
                  >
                    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">커스터마이징 가능</h3>
                <p className="text-muted-foreground">
                  팀의 요구 사항에 맞게 워크플로우, 대시보드 및 보고서를 커스터마이징할 수 있습니다.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
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
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m12 16 4-4-4-4"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">지속적인 개선</h3>
                <p className="text-muted-foreground">
                  사용자 피드백을 기반으로 지속적으로 기능을 개선하고 새로운 기능을 추가합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">지금 TeamSync를 시작하세요</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              팀 협업의 새로운 시대를 TeamSync와 함께 시작하세요. 간단한 가입 과정만으로 모든 기능을 바로 사용할 수
              있습니다.
            </p>
            <Link href="/login">
              <Button size="lg" className="px-8">
                무료로 시작하기
              </Button>
            </Link>
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
