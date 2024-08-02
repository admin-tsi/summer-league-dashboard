"use client";
import React, { useEffect, useState } from "react";
import Editinput from "../player/edit/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { teamCreationSchema } from "@/schemas/teamShema";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getDivisions } from "@/lib/api/division/division";
import { teamNames } from "@/constants/team/teamConstant";

type TeamCreationFormData = z.infer<typeof teamCreationSchema>;

type Props = {};

const TeamCreationForm = (props: Props) => {
  const currentUser: any = useCurrentUser();
  const [divisions, setDivisions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TeamCreationFormData>({
    resolver: zodResolver(teamCreationSchema),
  });

  const gender = watch("gender");

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const selectedCompetitionId = localStorage.getItem(
          "selectedCompetitionId"
        );
        if (selectedCompetitionId && gender) {
          const divisionsData = await getDivisions(
            selectedCompetitionId,
            gender
          );
          setDivisions(divisionsData);
        } else {
          setError("No competition or gender selected");
        }
      } catch (error) {
        setError("Failed to load divisions");
        console.error("Failed to load divisions", error);
      }
    };

    if (gender) {
      fetchDivisions();
    }
  }, [gender, currentUser.accessToken]);

  const onSubmit = (data: TeamCreationFormData) => {
    console.log(data);
  };

  const division = watch("division");
  const name = watch("name");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full md:w-2/3 lg:w-2/5 p-4 rounded-md shadow bg-muted grid grid-cols-1 gap-4"
    >
      <span className="text-primary text-2xl">Team creation</span>
      <div className="grid grid-cols-1 gap-3">
        <div className="w-full flex flex-col gap-2">
          <span className="text-sm">Team Name</span>
          <Select
            onValueChange={(value) => setValue("name", value)}
            value={name}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select team name" />
            </SelectTrigger>
            <SelectContent>
              {teamNames.map((teamName) => (
                <SelectItem key={teamName} value={teamName}>
                  {teamName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.name && (
            <span className="text-red-600 text-sm">{errors.name.message}</span>
          )}
        </div>
        <Editinput
          label="City"
          placeholder="Your team city"
          errorMessage={errors.city?.message}
          register={register("city")}
        />
        <div className="w-full flex flex-col gap-2">
          <span className="text-sm">Gender</span>
          <Select
            onValueChange={(value) => setValue("gender", value)}
            value={gender}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boys">Boys</SelectItem>
              <SelectItem value="girls">Girls</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <span className="text-red-600 text-sm">
              {errors.gender.message}
            </span>
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          <span className="text-sm">Division</span>
          <Select
            onValueChange={(value) => setValue("division", value)}
            value={division}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              {divisions.map((division) => (
                <SelectItem key={division._id} value={division._id}>
                  {division.divisionName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.division && (
            <span className="text-red-600 text-sm">
              {errors.division.message}
            </span>
          )}
        </div>

        <Button className="mt-3 bg-background border text-primary hover:text-white">
          Create my team
        </Button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
};

export default TeamCreationForm;
