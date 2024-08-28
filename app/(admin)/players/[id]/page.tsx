"use client";

import React, { useState, useEffect } from "react";
import { useForm, FieldError, FieldErrorsImpl } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCurrentToken } from "@/hooks/use-current-token";
import { playerEditSchema, players } from "@/lib/schemas/players/players";
import {
  updatePlayer,
  updatePlayerFiles,
  createPlayer,
  getPlayerById,
} from "@/lib/api/players/players";
import { Player } from "@/lib/types/players/players";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import LoadingSpinner from "@/components/loading-spinner";
import { CustomSelect } from "@/components/players/edit/custom-select";
import Dropzone from "@/components/players/edit/dragzone";
import EditInput from "@/components/players/edit/input";
import InteractiveStatusBadge from "@/components/players/edit/interactive-player-status-badge";
import { PositionSelect } from "@/components/players/edit/position-select";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { Button } from "@/components/ui/button";
import { countryCodes } from "@/constants/data/country-codes";

export default function Page({
  params,
}: {
  params: { id: string; token: string };
}) {
  const token = useCurrentToken();
  const currentUser: any = useCurrentUser();
  const [defPlayerValue, setDefPlayerValue] = useState<Partial<Player>>();
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(params.id !== "new");
  const [isLoading, setIsLoading] = useState(false);
  const [playerImage, setPlayerImage] = useState<File | null>(null);
  const [playerStatus, setPlayerStatus] = useState("");
  const [playerStatusComment, setPlayerStatusComment] = useState("");
  const [breadcrumbPaths, setBreadcrumbPaths] = useState([
    { label: "Management", href: "/" },
    { label: "Players", href: "/players" },
    { label: params.id === "new" ? "New Player" : "Loading..." },
  ]);

  const schema = isEditing ? playerEditSchema : players;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const position = watch("position");

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && token) {
        setIsLoading(true);
        try {
          const player = await getPlayerById(params.id, token);
          setDefPlayerValue(player);
          reset(player);

          let statusMessage = "Unknown";
          if (player?.playerStatus?.status === false) {
            statusMessage = player?.playerStatus?.comment
              ? "Rejected"
              : "Verification in progress";
          } else if (player?.playerStatus?.status === true) {
            statusMessage = "Verified";
          }
          setPlayerStatus(statusMessage);

          setBreadcrumbPaths([
            { label: "Management", href: "/players" },
            { label: "Players", href: "/players" },
            { label: `${player.firstName} ${player.lastName}` },
          ]);
        } catch (error: any) {
          setError(error.message);
          toast.error(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [isEditing, params.id, token, reset]);

  const handleImageUpload = async (file: File) => {
    setPlayerImage(file);
    setValue("playerImage", file);
  };

  const onSubmit = async (data: any) => {
    try {
      if (!token) {
        setError("Failed to refresh access token");
        return;
      }

      let playerData = { ...data };
      delete playerData.playerImage;

      const competitionId = localStorage.getItem("selectedCompetitionId");
      if (!competitionId) {
        throw new Error("Competition ID not found");
      }

      if (isEditing) {
        // Optimistic update
        setDefPlayerValue((prev) => ({ ...prev, ...playerData }));

        await updatePlayer(playerData, params.id, token);
        if (playerImage) {
          const formData = new FormData();
          formData.append("playerImage", playerImage);
          await updatePlayerFiles(formData, params.id, token);
        }
        toast.success("Player updated successfully");
      } else {
        const formData = new FormData();
        Object.keys(playerData).forEach((key) => {
          formData.append(key, playerData[key]);
        });
        if (playerImage) {
          formData.append("playerImage", playerImage);
        }
        const newPlayer = await createPlayer(
          token,
          currentUser.isManageTeam,
          formData,
          competitionId,
        );
        toast.success("Player created successfully");
        reset();
        // Redirect to edit page for the new player
        window.history.pushState({}, "", `/players/${newPlayer._id}`);
        setIsEditing(true);
        setDefPlayerValue(newPlayer);
      }
    } catch (error: any) {
      // Revert optimistic update if there's an error
      if (isEditing) {
        setDefPlayerValue((prev) => ({ ...prev }));
      }
      setError(error.message);
      toast.error(error.message);
    }
  };

  const updatePlayerStatus = (newStatus: string, newComment?: string) => {
    setPlayerStatus(newStatus);
    if (newComment) {
      setPlayerStatusComment(newComment);
    }
  };

  const getErrorMessage = (
    error: string | FieldError | FieldErrorsImpl<any> | undefined,
  ): string | undefined => {
    if (typeof error === "string") {
      return error;
    } else if (error && "message" in error) {
      return (error as FieldError).message;
    }
    return undefined;
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  return (
    <ContentLayout title="Players">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="pb-14 flex flex-col gap-5 md:justify-center"
      >
        <DynamicBreadcrumbs paths={breadcrumbPaths} />
        <div className="flex flex-col space-y-8">
          <div className="w-full flex flex-col justify-center items-center md:flex md:flex-row md:justify-normal gap-3">
            <div className="flex flex-col space-y-2">
              <Dropzone
                type="image"
                setValue={handleImageUpload}
                attribute="playerImage"
                playerImage={defPlayerValue?.playerImage}
              />
              {errors.playerImage && (
                <p className="text-sm text-red-500">
                  {getErrorMessage(errors.playerImage)}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-3">
              {isEditing && (
                <div className="flex justify-between items-center">
                  <InteractiveStatusBadge
                    currentStatus={playerStatus}
                    currentComment={playerStatusComment}
                    playerId={params.id}
                    onStatusUpdate={updatePlayerStatus}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <EditInput
                  id="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  register={register("firstName")}
                  errorMessage={getErrorMessage(errors.firstName)}
                />
                <EditInput
                  id="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                  register={register("lastName")}
                  errorMessage={getErrorMessage(errors.lastName)}
                />
                <EditInput
                  id="dorseyNumber"
                  label="Dorsey Number"
                  placeholder="Enter dorsey number"
                  register={register("dorseyNumber", {
                    valueAsNumber: true,
                  })}
                  errorMessage={getErrorMessage(errors.dorseyNumber)}
                  type="number"
                />
                <EditInput
                  id="college"
                  label="College"
                  placeholder="Enter college"
                  register={register("college")}
                  errorMessage={getErrorMessage(errors.college)}
                />
                <CustomSelect
                  label="Nationality"
                  placeholder="Select nationality"
                  options={countryCodes.map((country) => ({
                    id: country.id,
                    value: country.country,
                    label: `${country.emoji} ${country.country}`,
                  }))}
                  value={watch("nationality")}
                  onValueChange={(value) => setValue("nationality", value)}
                  error={getErrorMessage(errors.nationality)}
                />
                <EditInput
                  id="playerEmail"
                  label="Email"
                  placeholder="Enter email"
                  register={register("playerEmail")}
                  errorMessage={getErrorMessage(errors.playerEmail)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <EditInput
              id="birthdate"
              label="Birth date"
              type="date"
              placeholder="YYYY-MM-DD"
              register={register("birthdate")}
              errorMessage={getErrorMessage(errors.birthdate)}
            />
            <CustomSelect
              label="Country Code"
              placeholder="Select country code"
              options={countryCodes.map((country) => ({
                id: country.id,
                value: country.code,
                label: `${country.emoji} ${country.country} (${country.code})`,
              }))}
              value={watch("countryCode")}
              onValueChange={(value) => setValue("countryCode", value)}
              error={getErrorMessage(errors.countryCode)}
            />
            <EditInput
              id="phoneNumber"
              label="Phone Number"
              placeholder="You can register coach's phone number"
              register={register("phoneNumber", { valueAsNumber: true })}
              type="number"
              errorMessage={getErrorMessage(errors.phoneNumber)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <PositionSelect
              position={position}
              setValue={setValue}
              errors={errors}
            />
            <EditInput
              id="height"
              label="Height ( cm )"
              placeholder="Enter height"
              type="number"
              register={register("height", { valueAsNumber: true })}
              errorMessage={getErrorMessage(errors.height)}
            />
            <EditInput
              id="weight"
              label="Weight ( kg )"
              placeholder="Enter weight"
              type="number"
              register={register("weight", { valueAsNumber: true })}
              errorMessage={getErrorMessage(errors.weight)}
            />
          </div>
        </div>
        <div className="w-full flex justify-end gap-3 mt-5">
          <Button
            type="submit"
            variant="default"
            className="w-1/2 md:w-1/6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingSpinner text="Saving..." />
            ) : (
              <span>{isEditing ? "Update player" : "Create player"}</span>
            )}
          </Button>
        </div>
      </form>
    </ContentLayout>
  );
}
