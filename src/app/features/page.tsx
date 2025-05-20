import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FeaturesPage() {
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
        <div className="py-12 md:py-16">
          <div className="container">
            <h1 className="text-4xl font-bold mb-10">TeamSync의 기능</h1>

            <div className="grid md:grid-cols-2 gap-16 mb-16 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">직관적인 태스크 관리</h2>
                <p className="text-lg mb-4">
                  TeamSync의 직관적인 태스크 관리 시스템으로 팀의 작업을 체계적으로 관리하세요. 간단한 드래그 앤 드롭
                  인터페이스로 태스크를 쉽게 생성하고, 할당하고, 우선순위를 지정할 수 있습니다.
                </p>
                <p className="text-lg mb-4">
                  각 태스크에 마감일, 우선순위, 상태를 지정하고, 세부 설명과 첨부 파일을 추가할 수 있습니다. 태스크의
                  진행 상황을 실시간으로 추적하고, 완료된 작업을 한눈에 확인하세요.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>드래그 앤 드롭으로 손쉬운 태스크 관리</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>마감일 및 우선순위 설정</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>팀원 할당 및 진행 상황 추적</span>
                  </li>
                </ul>
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
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="14" x2="15" y2="14"></line>
                      <line x1="9" y1="10" x2="15" y2="10"></line>
                      <line x1="9" y1="6" x2="15" y2="6"></line>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 mb-16 items-center">
              <div className="order-last md:order-first bg-muted rounded-lg p-4 flex items-center justify-center">
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
                      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">실시간 협업</h2>
                <p className="text-lg mb-4">
                  TeamSync의 실시간 협업 도구를 사용하면 팀 전체가 동시에 작업하고 소통할 수 있습니다. 문서를 함께
                  편집하고, 댓글을 통해 피드백을 주고받으며, 실시간 채팅으로 즉각적인 소통이 가능합니다.
                </p>
                <p className="text-lg mb-4">
                  변경 사항은 자동으로 저장되고 동기화되므로, 모든 팀원이 항상 최신 버전으로 작업할 수 있습니다. 이제 더
                  이상 이메일로 파일을 주고받을 필요가 없습니다.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>실시간 문서 편집 및 동기화</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>댓글 및 피드백 시스템</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>팀 채팅 및 알림</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 mb-16 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">프로젝트 관리</h2>
                <p className="text-lg mb-4">
                  TeamSync의 프로젝트 관리 기능으로 모든 작업을 체계적으로 관리하세요. 각 프로젝트의 목표, 마일스톤,
                  일정을 설정하고, 진행 상황을 한눈에 확인할 수 있습니다.
                </p>
                <p className="text-lg mb-4">
                  간트 차트 및 칸반 보드와 같은 다양한 뷰를 통해 프로젝트를 다양한 관점에서 볼 수 있으며, 맞춤형
                  보고서로 프로젝트의 진행 상황을 쉽게 공유할 수 있습니다.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>간트 차트 및 칸반 보드</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>마일스톤 및 일정 관리</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>맞춤형 보고서 및 분석</span>
                  </li>
                </ul>
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
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
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
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">문서 관리</h3>
                <p className="text-muted-foreground">
                  팀 문서를 체계적으로 관리하고, 버전 관리로 변경 이력을 추적하며, 강력한 검색 기능으로 필요한 정보를
                  빠르게 찾을 수 있습니다.
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
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="20" y1="12" x2="20" y2="3"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">대시보드 및 분석</h3>
                <p className="text-muted-foreground">
                  직관적인 대시보드를 통해 프로젝트 진행 상황, 팀 성과, 중요한 지표를 한눈에 파악하고 데이터 기반의
                  의사결정을 내릴 수 있습니다.
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
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">팀 관리</h3>
                <p className="text-muted-foreground">
                  팀원 초대, 역할 및 권한 관리, 업무량 배분 등 팀 관리를 위한 다양한 도구로 효율적인 협업 환경을 구축할
                  수 있습니다.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 mb-16 items-center">
              <div className="order-last md:order-first bg-muted rounded-lg p-4 flex items-center justify-center">
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
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">소통과 알림</h2>
                <p className="text-lg mb-4">
                  TeamSync의 통합 메시징 시스템으로 팀 내 소통을 강화하세요. 프로젝트별 채팅, 태스크 댓글, @멘션 기능
                  등을 통해 정보를 빠르게 공유하고 의견을 교환할 수 있습니다.
                </p>
                <p className="text-lg mb-4">
                  맞춤형 알림 설정으로 중요한 업데이트를 놓치지 않고, 이메일, 앱 내 알림, 모바일 푸시 알림 등 다양한
                  방식으로 알림을 받을 수 있습니다.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>통합 메시징 및 @멘션</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>맞춤형 알림 설정</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>다양한 알림 채널</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 mb-16 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">커스터마이징 및 통합</h2>
                <p className="text-lg mb-4">
                  TeamSync는 팀의 고유한 워크플로우에 맞게 커스터마이징할 수 있습니다. 사용자 정의 필드, 태그, 상태 및
                  워크플로우를 설정하여 팀에 가장 적합한 방식으로 작업할 수 있습니다.
                </p>
                <p className="text-lg mb-4">
                  Slack, Google Workspace, Microsoft Teams 등 다양한 외부 도구와의 통합으로 기존 도구와 함께 원활하게
                  작동하며 워크플로우를 더욱 효율적으로 만들 수 있습니다.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>사용자 정의 필드 및 워크플로우</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>외부 도구 통합</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary mt-1"
                    >
                      <path d="m5 12 5 5L20 7"></path>
                    </svg>
                    <span>API 및 확장 기능</span>
                  </li>
                </ul>
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
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center py-10 mb-10 bg-muted rounded-lg">
              <h2 className="text-3xl font-bold mb-6">TeamSync로 팀을 강화하세요</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                더 나은 협업과 효율적인 프로젝트 관리를 위한 모든 도구가 한 곳에 있습니다. 지금 TeamSync를 시작하고 팀
                생산성을 한 단계 높여보세요.
              </p>
              <Link href="/login">
                <Button size="lg" className="px-8 py-6 text-lg">
                  무료로 시작하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Team</span>
            <span className="text-xl font-bold">Sync</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              소개
            </Link>
            <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">
              기능
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              요금제
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              문의하기
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 TeamSync. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
