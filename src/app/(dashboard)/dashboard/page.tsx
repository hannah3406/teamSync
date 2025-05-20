import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: '대시보드 | TeamSync',
  description: 'TeamSync 대시보드',
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded-lg shadow bg-card text-card-foreground flex flex-col gap-2">
          <div className="text-2xl font-bold">태스크</div>
          <p className="text-muted-foreground">태스크를 관리하고 진행 상황을 추적하세요</p>
          <div className="text-3xl font-bold mt-2">0</div>
        </div>
        <div className="p-6 border rounded-lg shadow bg-card text-card-foreground flex flex-col gap-2">
          <div className="text-2xl font-bold">프로젝트</div>
          <p className="text-muted-foreground">모든 프로젝트를 확인하세요</p>
          <div className="text-3xl font-bold mt-2">0</div>
        </div>
        <div className="p-6 border rounded-lg shadow bg-card text-card-foreground flex flex-col gap-2">
          <div className="text-2xl font-bold">문서</div>
          <p className="text-muted-foreground">공유 문서에 접근하세요</p>
          <div className="text-3xl font-bold mt-2">0</div>
        </div>
      </div>
      <div className="border rounded-lg shadow bg-card text-card-foreground">
        <div className="p-6">
          <h3 className="text-lg font-medium">최근 활동</h3>
          <p className="text-sm text-muted-foreground mt-2">최근 활동이 없습니다</p>
        </div>
      </div>
    </div>
  );
}
