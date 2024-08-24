import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "../loading-spinner";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

type TeamRecapDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  data: {
    teamName: string;
    city: string;
    teamGender: string;
    division: string;
  };
  divisionName: string;
};

const TeamRecapDialog: React.FC<TeamRecapDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  divisionName,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit();
    } finally {
      setIsLoading(false);
      toast.success("The team has been successfully created");
      onClose();
      await signOut();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Team Summary</DialogTitle>
          <DialogDescription>
            Review your team&apos;s information before confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-right">Team Name: </Label>
            <span className="col-span-3">{data.teamName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-right">City: </Label>
            <span className="col-span-3">{data.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-right">Gender: </Label>
            <span className="col-span-3">{data.teamGender}</span>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-right">Division: </Label>
            <span className="col-span-3">{divisionName}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Edit
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary text-white"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner text="Confirming..." /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamRecapDialog;
