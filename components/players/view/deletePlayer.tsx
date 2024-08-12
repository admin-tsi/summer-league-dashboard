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
import { Button } from "@/components/ui/button";
import { deletePlayer } from "@/lib/api/players/players";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCurrentToken } from "@/hooks/use-current-token";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeletePlayerProps {
  playerId: string;
  handleDelete: () => void;
}

export function DeletePlayer({ playerId, handleDelete }: DeletePlayerProps) {
  const handleDeletePlayer = async () => {
    const token = useCurrentToken();
    if (token) {
      try {
        await deletePlayer(playerId, token);
        toast.success("Player deleted successfully");
        handleDelete();
      } catch (error) {
        toast.error("Failed to delete player");
      }
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          aria-label="Delete"
          className="p-2 rounded hover:bg-gray-100"
          variant="ghost"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Trash2 className="h-4 text-red-500" />
              </TooltipTrigger>
              <TooltipContent>
                <span>Delete user</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-primary">
            This action cannot be undone. This will permanently delete the
            player and remove his data from our servers.
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
