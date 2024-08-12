import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCurrentToken } from "@/hooks/use-current-token";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deletePlayer } from "@/lib/api/players/players";

interface DeletePlayerProps {
  playerId: string;
  onDelete: () => void;
}

export function DeletePlayer({ playerId, onDelete }: DeletePlayerProps) {
  const token = useCurrentToken();

  const handleDeletePlayer = async () => {
    if (token) {
      try {
        await deletePlayer(playerId, token);
        toast.success("Player deleted successfully");
        onDelete();
      } catch (error) {
        toast.error("Failed to delete player");
      }
    }
  };

  return (
    <AlertDialog>
      <TooltipProvider>
        <Tooltip>
          <AlertDialogTrigger asChild>
            <TooltipTrigger asChild>
              <button className="p-2 rounded hover:bg-gray-100">
                <Trash2 className="h-4 text-red-500" />
              </button>
            </TooltipTrigger>
          </AlertDialogTrigger>
          <TooltipContent>
            <span>Delete user</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-primary">
            This action cannot be undone. This will permanently delete the
            player and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeletePlayer}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
