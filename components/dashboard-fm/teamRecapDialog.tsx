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
import { Check } from "lucide-react";

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
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 mb-1">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-xl font-semibold text-gray-800">
              Team Summary
            </span>
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mb-6">
            Review your team&apos;s information before confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-primary/10 rounded-md p-4 mb-6 border border-primary">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-right">Team Name: </Label>
              <span className="col-span-3 font-semibold">{data.teamName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-right">City: </Label>
              <span className="col-span-3 font-semibold">{data.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-right">Gender: </Label>
              <span className="col-span-3 font-semibold first-letter:uppercase">
                {data.teamGender}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-right">Division: </Label>
              <span className="col-span-3 font-semibold">{divisionName}</span>
            </div>
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
