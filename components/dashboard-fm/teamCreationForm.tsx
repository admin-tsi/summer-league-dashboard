"use client";
import React, { useEffect, useState } from "react";
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
import { useCurrentUser } from "@/hooks/use-current-user";
import { getDivisions } from "@/lib/api/division/division";
import { teamNames } from "@/constants/team/teams";
import { createTeam } from "@/lib/api/teams/teams";
import LoadingSpinner from "../loading-spinner";
import { teamCreationSchema } from "@/lib/schemas/team/team";
import FormError from "../login/form-error";
import { signOut } from "next-auth/react";
import TeamRecapDialog from "./teamRecapDialog";
import { cities } from "@/constants/data/cities";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  const teamName = watch("teamName");
  const city = watch("city");
  const division = watch("division");
  const formData = watch();

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
    const token = currentUser.accessToken;
    if (token) {
      try {
        if (currentUser.accessToken) {
          const response = await createTeam(data, token, selectedCompetitionId);
          onSuccess(response._id);
          await signOut();
        } else {
          setError("No access token available");
        }
      } catch (error: any) {
        setError(error.message);
      }
    } else {
      setError(
        "We're having trouble logging you in. Please refresh the page or log out temporarily."
      );
    }
  };

  const handleShowRecap = () => {
    if (Object.keys(errors).length === 0) {
      setIsDialogOpen(true);
    }
  };

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
        <div className="w-full flex flex-col gap-2">
          <span className="text-sm">City</span>
          <Select
            onValueChange={(value) => setValue("city", value)}
            value={city}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && (
            <span className="text-red-600 text-sm">{errors.city.message}</span>
          )}
        </div>
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
          type="button"
          onClick={handleShowRecap}
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className="mt-3 bg-background border text-primary hover:text-white"
        >
          Check information and submit
        </Button>
      </div>
      {error && <FormError message={error} />}

      <TeamRecapDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit(onSubmit)}
        data={formData}
        divisionName={
          divisions.find((d) => d._id === formData.division)?.divisionName || ""
        }
      />
    </form>
  );
};

export default TeamCreationForm;
