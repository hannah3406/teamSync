'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Crown, Shield, User, MoreVertical } from 'lucide-react';

interface ProjectMember {
  id: string;
  role: string;
  joinedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface ProjectMembersListProps {
  members: ProjectMember[];
  currentUserId: string;
  canManage: boolean;
}

export default function ProjectMembersList({ members, currentUserId, canManage }: ProjectMembersListProps) {
  // 역할에 따른 아이콘과 라벨
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'owner':
        return {
          icon: <Crown className="h-4 w-4" />,
          label: '소유자',
          color: 'text-yellow-500',
        };
      case 'admin':
        return {
          icon: <Shield className="h-4 w-4" />,
          label: '관리자',
          color: 'text-blue-500',
        };
      default:
        return {
          icon: <User className="h-4 w-4" />,
          label: '멤버',
          color: 'text-gray-500',
        };
    }
  };

  // 역할별로 정렬 (owner > admin > member)
  const sortedMembers = [...members].sort((a, b) => {
    const roleOrder = { owner: 0, admin: 1, member: 2 };
    return (roleOrder[a.role as keyof typeof roleOrder] || 2) - (roleOrder[b.role as keyof typeof roleOrder] || 2);
  });

  return (
    <div className="space-y-4">
      {sortedMembers.map((member) => {
        const roleDisplay = getRoleDisplay(member.role);
        const isCurrentUser = member.user.id === currentUserId;

        return (
          <Card key={member.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.user.image || ''} alt={member.user.name || ''} />
                  <AvatarFallback>{member.user.name?.charAt(0) || member.user.email?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{member.user.name || member.user.email}</p>
                    {isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">
                        나
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`flex items-center gap-1 ${roleDisplay.color}`}>
                  {roleDisplay.icon}
                  {roleDisplay.label}
                </Badge>

                {canManage && !isCurrentUser && member.role !== 'owner' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.role === 'member' && (
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          관리자로 변경
                        </DropdownMenuItem>
                      )}
                      {member.role === 'admin' && (
                        <DropdownMenuItem>
                          <User className="h-4 w-4 mr-2" />
                          멤버로 변경
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive">프로젝트에서 제거</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
