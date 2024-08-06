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
import { useCurrentUser } from "@/hooks/use-current-user";
import { verifyTokenExpiration } from "@/lib/api/auth/refresh-access-provider";
import { deletePlayer } from "@/lib/api/players/players";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeletePlayerProps {
  playerId: string;
  handleDelete: () => void;
}

export function DeletePlayer({ playerId, handleDelete }: DeletePlayerProps) {
  const currentUser: any = useCurrentUser();

  const handleDeletePlayer = async () => {
    const newAccessToken = await verifyTokenExpiration(
      currentUser.accessToken,
      currentUser.refreshToken
    );
    if (newAccessToken) {
      try {
        await deletePlayer(playerId, newAccessToken);
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
        <Button variant="def">
          <Trash2 className="h-4 text-red-500" />
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
