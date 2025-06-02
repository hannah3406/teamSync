import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TeamList } from "@/components/teams/team-list";
import { CreateTeamDialog } from "@/components/teams/create-team-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function TeamsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">팀</h1>
          <p className="text-muted-foreground mt-1">
            팀을 생성하고 프로젝트를 함께 관리하세요
          </p>
        </div>
        <CreateTeamDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />새 팀 만들기
          </Button>
        </CreateTeamDialog>
      </div>

      <TeamList />
    </div>
  );
}
