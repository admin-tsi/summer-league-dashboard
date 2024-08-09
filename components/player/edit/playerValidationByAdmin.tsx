import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import { playerValidationSchema } from "@/schemas/playerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

type FormValues = z.infer<typeof playerValidationSchema>;

export function PlayerValidationByAdmin() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(playerValidationSchema),
    defaultValues: {
      status: undefined,
      comment: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setError("");
    const decision = {
      status: data.status === "approved",
      comment: data.comment,
    };
    if (!decision.status && decision.comment === "") {
      setError(
        "When you make a decision to reject something, it is necessary to provide a reason for your decision. This helps ensure clarity and understanding regarding the grounds for the rejection."
      );
      return;
    } else {
      console.log(decision);
      setOpen(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-1/2 md:w-1/6">
          Update player status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:w-[80%] md:w-[60%] lg:w-[30%]">
        <DialogHeader>
          <DialogTitle>Validate player profile</DialogTitle>
          <DialogDescription>
            Make Summer league team player. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="decision">Decision</Label>
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
                      <SelectItem value="approved">Profile Approved</SelectItem>
                      <SelectItem value="rejected">Profile Rejected</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-red-500">{errors.status.message}</p>
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
                />
              )}
            />
            {errors.comment && (
              <p className="text-red-500">{errors.comment.message}</p>
            )}
          </div>
          <div className="w-full">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit(onSubmit)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
