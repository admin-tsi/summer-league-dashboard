import React from "react";
import Editinput from "../player/edit/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { teamCreationSchema } from "@/schemas/teamShema";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

type TeamCreationFormData = z.infer<typeof teamCreationSchema>;

type Props = {};

const TeamCreationForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamCreationFormData>({
    resolver: zodResolver(teamCreationSchema),
  });

  const onSubmit = (data: TeamCreationFormData) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full md:w-2/3 lg:w-2/5 p-4 rounded-md shadow bg-muted grid grid-cols-1 gap-4"
    >
      <span className="text-primary text-2xl">Team creation</span>
      <div className="grid grid-cols-1 gap-3">
        <Editinput
          label="Name"
          placeholder="Your team name"
          errorMessage={errors.name?.message}
          register={register("name")}
        />
        <Editinput
          label="City"
          placeholder="Your team city"
          errorMessage={errors.city?.message}
          register={register("city")}
        />
        <Editinput
          label="Gender"
          placeholder="Your team gender"
          errorMessage={errors.gender?.message}
          register={register("gender")}
        />
        <Editinput
          label="Division"
          placeholder="Your team division"
          errorMessage={errors.division?.message}
          register={register("division")}
        />
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        <Button className="mt-3 bg-background border text-primary hover:text-white">
          Create my team
        </Button>
      </div>
    </form>
  );
};

export default TeamCreationForm;
