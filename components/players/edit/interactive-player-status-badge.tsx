import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCurrentUser } from "@/hooks/use-current-user";
import { validatePlayerProfile } from "@/lib/api/players/players";
import LoadingSpinner from "@/components/loading-spinner";

const playerValidationSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof playerValidationSchema>;

interface InteractiveStatusBadgeProps {
  currentStatus: string;
  currentComment?: string;
  playerId?: string;
  onStatusUpdate: (newStatus: string, newComment?: string) => void;
}

const InteractiveStatusBadge: React.FC<InteractiveStatusBadgeProps> = ({
  currentStatus,
  currentComment,
  playerId,
  onStatusUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const currentUser: any = useCurrentUser();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(playerValidationSchema),
    defaultValues: {
      status: undefined,
      comment: currentComment || "",
    },
  });

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-primary-green/90 hover:bg-primary-green text-white";
      case "Rejected":
        return "bg-destructive/90 hover:bg-destructive text-white";
      case "Verification in progress":
        return "bg-primary-yellow/90 hover:bg-primary-yellow text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const onSubmit = async (data: FormValues) => {
    setError("");
    const playerDecision = {
      status: data.status === "approved",
      comment: data.comment,
    };

    if (!playerDecision.status && !playerDecision.comment) {
      setError("A comment is required when rejecting a player profile.");
      return;
    }

    try {
      const accessToken = currentUser?.token;

      if (!accessToken) {
        throw new Error("Failed to verify token expiration");
      }

      if (playerId) {
        await validatePlayerProfile(accessToken, playerId, playerDecision);
        const newStatus = data.status === "approved" ? "Verified" : "Rejected";
        onStatusUpdate(newStatus, data.comment);
        setIsOpen(false);
        reset();
      } else {
        setError("Player ID is required to validate the player profile.");
      }
    } catch (error) {
      console.error("Error validating player:", error);
      setError("There was an error validating the player. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Badge
            className={`cursor-pointer py-2 px-4 font-semibold rounded-full transition-all duration-300 ease-in-out ${getBadgeStyle(currentStatus)}`}
          >
            {currentStatus}
          </Badge>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Update Player Status
          </DialogTitle>
          <DialogDescription>
            Make a decision on the player's profile. Provide a comment if
            rejecting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="status">Decision</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Your decision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Player profile validation</SelectLabel>
                        <SelectItem value="approved">
                          Profile Approved
                        </SelectItem>
                        <SelectItem value="rejected">
                          Profile Rejected
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-destructive text-sm">
                  {errors.status.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="comment">Comment</Label>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Type your comment about this player validation here."
                    className="border-2 border-input focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                )}
              />
              {errors.comment && (
                <p className="text-destructive text-sm">
                  {errors.comment.message}
                </p>
              )}
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out"
            >
              {isSubmitting ? (
                <LoadingSpinner text="Updating..." />
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InteractiveStatusBadge;
