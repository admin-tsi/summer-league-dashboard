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
import { verifyTokenExpiration } from "@/lib/api/auth/refresh-access-provider";
import { createTeam } from "@/lib/api/teams/teams";
import LoadingSpinner from "../loading-spinner";

type TeamCreationFormData = z.infer<typeof teamCreationSchema>;

type Props = {
  onSuccess: (teamId: string) => void;
};

const TeamCreationForm = ({ onSuccess }: Props) => {
  const currentUser: any = useCurrentUser();
  const [divisions, setDivisions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState("");
  const [isDivisionsLoading, setIsDivisionsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<TeamCreationFormData>({
    resolver: zodResolver(teamCreationSchema),
  });

  const teamGender = watch("teamGender");

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        setIsDivisionsLoading(true);
        const selectedCompetitionId = localStorage.getItem(
          "selectedCompetitionId"
        );
        if (selectedCompetitionId && teamGender) {
          setSelectedCompetitionId(selectedCompetitionId);
          const divisionsData = await getDivisions(
            selectedCompetitionId,
            teamGender
          );
          setDivisions(divisionsData);
        } else {
          setError("No competition or gender selected");
        }
      } catch (error) {
        setError("Failed to load divisions");
        console.error("Failed to load divisions", error);
      } finally {
        setIsDivisionsLoading(false);
      }
    };

    if (teamGender) {
      fetchDivisions();
    }
  }, [teamGender]);

  const onSubmit = async (data: TeamCreationFormData) => {
    const newAccessToken = await verifyTokenExpiration(
      currentUser.accessToken,
      currentUser.refreshToken
    );
    if (newAccessToken) {
      try {
        if (currentUser.accessToken) {
          const response = await createTeam(
            data,
            newAccessToken,
            selectedCompetitionId
          );
          console.log("Team created successfully");
          onSuccess(response._id);
        } else {
          console.error("No access token available");
          setError("No access token available");
        }
      } catch (error: any) {
        console.error(error.message);
        setError(error.message);
      }
    } else {
      console.log("Impossible to get a new access token.");
    }
    console.log(data);
  };

  const division = watch("division");
  const teamName = watch("teamName");

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
            onValueChange={(value) => setValue("teamName", value)}
            value={teamName}
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
          {errors.teamName && (
            <span className="text-red-600 text-sm">
              {errors.teamName.message}
            </span>
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
            onValueChange={(value) => setValue("teamGender", value)}
            value={teamGender}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boys">Boys</SelectItem>
              <SelectItem value="girls">Girls</SelectItem>
            </SelectContent>
          </Select>
          {errors.teamGender && (
            <span className="text-red-600 text-sm">
              {errors.teamGender.message}
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
              {isDivisionsLoading ? (
                <div className="flex justify-center items-center py-4">
                  <LoadingSpinner text="Loading of divisions" />
                </div>
              ) : (
                divisions.map((division) => (
                  <SelectItem key={division._id} value={division._id}>
                    {division.divisionName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.division && (
            <span className="text-red-600 text-sm">
              {errors.division.message}
            </span>
          )}
        </div>

        <Button
          disabled={isSubmitting}
          className="mt-3 bg-background border text-primary hover:text-white"
        >
          {isSubmitting ? (
            <div>
              <LoadingSpinner text="Loading..." />
            </div>
          ) : (
            <span>Create my team</span>
          )}
        </Button>
      </div>
      {error && (
        <div className="text-red-600 text-sm w-full flex justify-center items-center">
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};

export default TeamCreationForm;
