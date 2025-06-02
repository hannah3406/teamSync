"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, FolderKanban, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    members: number;
    projects: number;
  };
}

export function TeamList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/teams");

      if (!response.ok) {
        throw new Error("팀 목록을 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      setTeams(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchTeams} variant="outline">
          다시 시도
        </Button>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          아직 팀이 없습니다
        </h3>
        <p className="text-gray-500 mb-6">
          첫 번째 팀을 만들어 협업을 시작해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <Card key={team.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">
                  <Link
                    href={`/dashboard/teams/${team.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {team.name}
                  </Link>
                </CardTitle>
                {team.description && (
                  <p
                    className="text-sm text-muted-foreground"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {team.description}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/teams/${team.id}/settings`}>
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">팀장</span>
                <span className="font-medium">
                  {team.owner.name || team.owner.email}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-3 w-3" />
                  {team._count.members}명
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <FolderKanban className="mr-1 h-3 w-3" />
                  {team._count.projects}개 프로젝트
                </div>
              </div>

              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {new Date(team.createdAt).toLocaleDateString("ko-KR")}에 생성
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
