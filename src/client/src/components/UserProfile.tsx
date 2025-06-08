import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Mail, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UserProfile() {
  const { user } = useAuth();

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profileImageUrl || ''} alt={displayName} />
            <AvatarFallback className="text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{displayName}</CardTitle>
        <Badge variant="secondary" className="mx-auto">
          Rule One Investor
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="h-4 w-4" />
          <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <User className="h-4 w-4" />
          <span>ID: {user.id}</span>
        </div>
        
        <div className="pt-4 border-t">
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}