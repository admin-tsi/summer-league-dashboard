"use client";

import { Key, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { useCurrentToken } from "@/hooks/use-current-token";
import { useCurrentUser } from "@/hooks/use-current-user";
import { AskChangePassword } from "@/lib/api/auth/changePassword";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function UserNav() {
  const user = useCurrentUser();
  const token = useCurrentToken();

  const firstName = user?.user?.firstName;
  const lastName = user?.user?.lastName;
  const email = user?.user?.email;
  const role = user?.user?.role;

  const handleChangePassword = async () => {
    if (
      !email ||
      !user?.user?.accessToken ||
      !user?.user.refreshToken ||
      !token
    ) {
      toast.error("Missing required information to change password");
      return;
    }

    try {
      const result = await AskChangePassword({ email });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || "Failed to request password change");
      }
    } catch (error) {
      toast.error("Error requesting password change");
      console.error("Error changing password:", error);
    }
  };

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full border hover:bg-primary/10"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {firstName?.[0] || "U"}
                    {lastName?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Your Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {firstName} {lastName}
              </p>
              {role && (
                <Badge variant="outline" className="ml-2 px-2 py-0.5 text-xs">
                  {role}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground break-all">{email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2"
          onClick={handleChangePassword}
        >
          <Key className="w-4 h-4" />
          Change Password
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
