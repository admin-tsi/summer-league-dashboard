"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import { LayoutGrid, LockKeyhole, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Badge } from "@/components/ui/badge";
import { AskChangePassword } from "@/lib/api/auth/changePassword";
import { verifyTokenExpiration } from "@/lib/api/auth/refresh-access-provider";

export function UserNav() {
  const user = useCurrentUser();
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
    const { accessToken, refreshToken } = user ?? {};

    if (accessToken && refreshToken) {
      const token = await verifyTokenExpiration(accessToken, refreshToken);

      if (token) {
        const emailToSend = email || "";

        const result = await AskChangePassword({
          email: emailToSend,
        });

        if (result.success) {
          console.log(result.message);
          toast(result.message);
        } else {
          console.error(result.error);
        }
      }
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
            <div className="w-1/2">
              <Badge variant="outline" className="">
                {role}
              </Badge>
            </div>
            <p className="text-sm font-medium leading-none">
              {firstName} {lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
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
