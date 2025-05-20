import { auth } from '@/lib/auth';
import { Navbar, NavbarBrand, NavbarItems } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import DashboardNav from '@/components/dashboard/dashboard-nav';
import { UserNav } from '@/components/dashboard/user-nav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex h-screen">
      <Sidebar>
        <div className="flex items-center gap-2 px-3 h-14">
          <NavbarBrand href="/dashboard">
            <span className="text-primary font-bold">Team</span>
            <span className="font-bold">Sync</span>
          </NavbarBrand>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <DashboardNav />
        </div>
      </Sidebar>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar>
          <div></div>
          <NavbarItems>{user && <UserNav user={user} />}</NavbarItems>
        </Navbar>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
