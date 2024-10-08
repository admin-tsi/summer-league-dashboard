"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Badge } from "@/components/ui/badge";
import { AskChangePassword } from "@/lib/api/auth/changePassword";
import { useCurrentToken } from "@/hooks/use-current-token";

export function UserNav() {
  const user = useCurrentUser();
  const token = useCurrentToken();
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [lastName, setLastName] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleChangePassword = async () => {
    if (user?.accessToken && user?.refreshToken && token) {
      const emailToSend = email ?? "";

      try {
        const result = await AskChangePassword({ email: emailToSend });
        if (result.success) {
          console.log(result.message);
          toast(result.message);
        } else {
          console.error(/*result.error ??*/ "Error changing password");
        }
      } catch (error) {
        console.error("Error changing password:", error);
      }
    } else {
      console.error("Missing required tokens or user information");
    }
  };
  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="#" alt="Avatar" />
                  <AvatarFallback className="bg-transparent">
                    {firstName != null ? firstName[0] : "J"}
                    {lastName != null ? lastName[0] : "D"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <Badge variant="outline" className="w-fit px-2 py-2">
              {role}
            </Badge>
            <p className="text-sm font-medium leading-none">
              {firstName} {lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/*
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/account" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <button
              className="flex items-center w-full"
              onClick={() => handleChangePassword()}
            >
              <LockKeyhole className="w-4 h-4 mr-3 text-muted-foreground" />
              Change Password
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
*/}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer bg-destructive text-destructive-foreground"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4 mr-3 text-destructive-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
