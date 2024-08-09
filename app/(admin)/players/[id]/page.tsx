"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import LoadingSpinner from "@/components/loading-spinner";
import { DocumentsSection } from "@/components/player/edit/documentsSection";
import Dropzone from "@/components/player/edit/dragzone";
import Editinput from "@/components/player/edit/input";
import { PlayerValidationByAdmin } from "@/components/player/edit/playerValidationByAdmin";
import { PositionSelect } from "@/components/player/edit/positionSelect";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { verifyTokenExpiration } from "@/lib/api/auth/refresh-access-provider";
import {
  createPlayer,
  getPlayerById,
  updatePlayer,
  updatePlayerFiles,
} from "@/lib/api/players/players";
import { Player } from "@/lib/types/players/players";
import { playerEditSchema, playerSchema } from "@/schemas/playerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type PartialPlayer = Partial<Player>;

export default function Page({
  params,
}: {
  params: { id: string; token: string };
}) {
  const currentUser: any = useCurrentUser();
  const [defPlayerValue, setDefPlayerValue] = useState<PartialPlayer>();
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(params.id !== "New");
  const [isLoading, setIsLoading] = useState(false);
  const [fullTeam, setFullTeam] = useState<boolean>(false);
  const [playerStatus, setPlayerStatus] = useState("");

  const [breadcrumbPaths, setBreadcrumbPaths] = useState([
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Players", href: "/players" },
    { label: params.id === "New" ? "New Player" : "Loading..." },
  ]);

  const schema = isEditing ? playerEditSchema : playerSchema;

  type FormFields = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const position = watch("position");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditing) {
          setIsLoading(true);
          const newAccessToken = await verifyTokenExpiration(
            currentUser.accessToken,
            currentUser.refreshToken
          );

          if (newAccessToken) {
            const player = await getPlayerById(params.id, newAccessToken);
            setDefPlayerValue(player);

            let statusMessage;
            if (player?.playerStatus?.status === false) {
              statusMessage = player?.playerStatus?.comment
                ? "Rejected"
                : "Verification in progress";
            } else if (player?.playerStatus?.status === true) {
              statusMessage = "Verified";
            } else {
              statusMessage = "Unknown";
            }

            setPlayerStatus(statusMessage);

            setBreadcrumbPaths([
              { label: "Home", href: "/" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Players", href: "/players" },
              { label: `${player.firstName} ${player.lastName}` },
            ]);
            //@ts-ignore
            reset(player);
            setIsLoading(false);
          } else {
            setError("Failed to refresh access token");
          }
        } else {
          const currentCount = parseInt(
            localStorage.getItem("playersCount") || "0",
            10
          );
          if (currentCount >= 8) {
            setFullTeam(true);
          }
        }
      } catch (error: any) {
        setError(error.message);
        toast(error.message);
      }
    };

    fetchData();
  }, [params.id, currentUser, isEditing, reset]);

  useEffect(() => {
    if (!isEditing) {
      const subscription = watch((value: any) => {
        localStorage.setItem("formData", JSON.stringify(value));
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      const savedFormData = localStorage.getItem("formData");
      if (savedFormData) {
        reset(JSON.parse(savedFormData));
      }
    }
  }, [reset, isEditing]);

  const onSubmit = async (data: FormFields) => {
    try {
      const newAccessToken = await verifyTokenExpiration(
        currentUser.accessToken,
        currentUser.refreshToken
      );

      if (!newAccessToken) {
        setError("Failed to refresh access token");
        return;
      }

      if (isEditing) {
        await handleUpdatePlayer(data, params.id, newAccessToken);
      } else {
        await handleCreatePlayer(data, currentUser);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(`${error.message}`);
    }
  };

  const handleUpdatePlayer = async (
    data: FormFields,
    playerId: string,
    newAccessToken: string
  ) => {
    const updateData: Partial<Player> = extractPlayerUpdateData(data);
    const updateFiles = createUpdateFilesFormData(data);

    const dataResponse = await updatePlayer(
      updateData,
      playerId,
      newAccessToken
    );
    console.log("dataResponse: ", dataResponse);

    if (hasUpdateFiles(updateFiles)) {
      const fileResponse = await updatePlayerFiles(
        updateFiles,
        playerId,
        newAccessToken
      );
      console.log("fileResponse: ", fileResponse);
    }

    toast("The player has been successfully updated.");
  };

  const handleCreatePlayer = async (data: FormFields, currentUser: any) => {
    const formData = createCreatePlayerFormData(data);
    const competeId = localStorage.getItem("selectedCompetitionId");

    await createPlayer(
      currentUser.accessToken,
      currentUser.isManageTeam,
      formData,
      competeId
    );
    updatePlayersCount();
    toast.success("The player has been successfully created.");
    reset();
    localStorage.removeItem("formData");
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const updatePlayersCount = () => {
    let currentCount = parseInt(
      localStorage.getItem("playersCount") || "0",
      10
    );
    currentCount += 1;
    localStorage.setItem("playersCount", currentCount.toString());
  };

  const extractPlayerUpdateData = (data: FormFields): Partial<Player> => {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (!["playerImage", "cipFile", "birthCertificate"].includes(key)) {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as Partial<Player>);
  };

  const createUpdateFilesFormData = (data: FormFields): FormData => {
    const updateFiles = new FormData();
    ["playerImage", "cipFile", "birthCertificate"].forEach((key) => {
      const value = data[key as keyof FormFields];
      if (value) {
        if (value instanceof FileList) {
          Array.from(value).forEach((file) => {
            updateFiles.append(key, file);
          });
        } else if (value instanceof File) {
          updateFiles.append(key, value);
        }
      }
    });
    return updateFiles;
  };

  const createCreatePlayerFormData = (data: FormFields): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value == null) {
        return;
      }

      if (value instanceof FileList) {
        Array.from(value).forEach((file) => {
          formData.append(key, file);
        });
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "object" || Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });
    return formData;
  };

  const hasUpdateFiles = (updateFiles: FormData): boolean => {
    return (
      updateFiles.has("playerImage") ||
      updateFiles.has("cipFile") ||
      updateFiles.has("birthCertificate")
    );
  };

  return isLoading ? (
    <div className="h-screen w-full flex justify-center items-center">
      <LoadingSpinner text="Loading..." />
    </div>
  ) : (
    <ContentLayout title="Players">
      {fullTeam ? (
        <>
          <DynamicBreadcrumbs paths={breadcrumbPaths} />
          <div className="flex justify-center items-center w-full h-[80vh]">
            <p className="w-full md:w-1/3 text-center">
              Your team is complete, and you can no longer add new players. You
              can only delete or modify existing players.
            </p>
          </div>
        </>
      ) : (
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
                  setValue={setValue}
                  attribute="playerImage"
                  playerImage={defPlayerValue?.playerImage}
                />
                {errors.playerImage && (
                  <p className="text-sm text-red-500">
                    {errors.playerImage.message}
                  </p>
                )}
              </div>
              <div className="w-full flex flex-col gap-3">
                {isEditing && (
                  <div className="flex justify-between items-center">
                    {playerStatus === "Rejected" ? (
                      <div className="flex flex-col">
                        <div className="flex gap-2">
                          <span>Player status:</span>
                          <span>{playerStatus}</span>
                        </div>
                        <div className="flex gap-2">
                          <span>Motif:</span>
                          <span>{defPlayerValue?.playerStatus?.comment}</span>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="w-fit py-3 px-6">
                        {playerStatus}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Editinput
                    id="firstName"
                    label="First Name"
                    placeholder="Enter first name"
                    register={register("firstName")}
                    errorMessage={errors.firstName?.message}
                  />
                  <Editinput
                    id="lastName"
                    label="Last Name"
                    placeholder="Enter last name"
                    register={register("lastName")}
                    errorMessage={errors.lastName?.message}
                  />
                  <Editinput
                    id="dorseyNumber"
                    label="Dorsey Number"
                    placeholder="Enter dorsey number"
                    register={register("dorseyNumber", {
                      valueAsNumber: true,
                    })}
                    errorMessage={errors.dorseyNumber?.message}
                    type="number"
                  />
                  <Editinput
                    id="college"
                    label="College"
                    placeholder="Enter college"
                    register={register("college")}
                    errorMessage={errors.college?.message}
                  />
                  <Editinput
                    id="nationality"
                    label="Nationality"
                    placeholder="Enter nationality"
                    register={register("nationality")}
                    errorMessage={errors.nationality?.message}
                  />
                  <Editinput
                    id="playerEmail"
                    label="Email"
                    placeholder="Enter email"
                    register={register("playerEmail")}
                    errorMessage={errors.playerEmail?.message}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <Editinput
                id="birthdate"
                label="Birth date"
                type="date"
                placeholder="+229"
                register={register("birthdate")}
                errorMessage={errors.birthdate?.message}
              />
              <Editinput
                id="countryCode"
                label="Country Code"
                placeholder="+229"
                register={register("countryCode")}
                errorMessage={errors.countryCode?.message}
              />
              <Editinput
                id="phoneNumber"
                label="Phone Number"
                placeholder="96000000"
                register={register("phoneNumber", { valueAsNumber: true })}
                type="number"
                errorMessage={errors.phoneNumber?.message}
              />
              <Editinput
                id="yearOfExperience"
                label="Years of Experience"
                placeholder="1"
                register={register("yearOfExperience", {
                  valueAsNumber: true,
                })}
                type="number"
                errorMessage={errors.yearOfExperience?.message}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <PositionSelect
                position={position}
                setValue={setValue}
                errors={errors}
              />
              <Editinput
                id="height"
                label="Height ( cm )"
                placeholder="Enter height"
                type="number"
                register={register("height", { valueAsNumber: true })}
                errorMessage={errors.height?.message}
              />
              <Editinput
                id="weight"
                label="Weight ( kg )"
                placeholder="Enter weight"
                type="number"
                register={register("weight", { valueAsNumber: true })}
                errorMessage={errors.weight?.message}
              />
            </div>
            <DocumentsSection
              isEditing={isEditing}
              defPlayerValue={defPlayerValue}
              setValue={setValue}
              errors={errors}
            />
          </div>
          <div className="w-full flex justify-end gap-3 mt-5">
            {currentUser.role === "admin" && <PlayerValidationByAdmin />}
            <Button type="submit" variant="default" className="w-1/2 md:w-1/6">
              {isSubmitting ? (
                <div>
                  <LoadingSpinner text="Loading..." />
                </div>
              ) : (
                <span>{isEditing ? "Update player" : "Create player"}</span>
              )}
            </Button>
          </div>
        </form>
      )}
    </ContentLayout>
  );
}
