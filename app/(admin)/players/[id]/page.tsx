"use client";
import LoadingSpinner from "@/components/loading-spinner";
import Dropzone from "@/components/player/edit/dragzone";
import Editinput from "@/components/player/edit/input";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { positions } from "@/constants/player/playerPositionConstant";
import { useCurrentUser } from "@/hooks/use-current-user";
import { verifyTokenExpiration } from "@/lib/api/auth/refresh-access-provider";
import { createPlayer, getPlayerById } from "@/lib/api/players/players";
import { Player } from "@/lib/types/players/players";
import { playerSchema } from "@/schemas/playerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
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
  type Formfields = z.infer<typeof playerSchema>;

  const currentUser: any = useCurrentUser();
  const [defPlayerValue, setDefPlayerValue] = useState<PartialPlayer>();
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(params.id !== "New");
  const [isLoading, setIsLoading] = useState(false);

  const [breadcrumbPaths, setBreadcrumbPaths] = useState([
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Players", href: "/players" },
    { label: params.id === "New" ? "New Player" : "Loading..." },
  ]);
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
            console.log("playerrrrrrr: ", player);

            setBreadcrumbPaths([
              { label: "Home", href: "/" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Players", href: "/players" },
              { label: `${player.firstName} ${player.lastName}` },
            ]);
            reset(player);
            setIsLoading(false);
          } else {
            setError("Failed to refresh access token");
          }
        }
      } catch (error: any) {
        setError(error.message);
        toast(error.message);
      }
    };

    fetchData();
  }, [params.id, currentUser, isEditing]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<Formfields>({
    resolver: zodResolver(playerSchema),
    defaultValues:
      params.id === "New"
        ? {}
        : {
            firstName: defPlayerValue?.firstName,
            lastName: defPlayerValue?.lastName,
            dorseyNumber: defPlayerValue?.dorseyNumber,
            college: defPlayerValue?.college,
            nationality: defPlayerValue?.nationality,
            playerEmail: defPlayerValue?.playerEmail,
            birthdate: defPlayerValue?.birthdate,
            countryCode: defPlayerValue?.countryCode,
            phoneNumber:
              defPlayerValue?.phoneNumber !== undefined
                ? Number(defPlayerValue.phoneNumber)
                : undefined,
            yearOfExperience: defPlayerValue?.yearOfExperience,
            height: defPlayerValue?.height,
            weight: defPlayerValue?.weight,
          },
  });

  const position = watch("position");

  useEffect(() => {
    const subscription = watch((value: any) => {
      localStorage.setItem("formData", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      reset(JSON.parse(savedFormData));
    }
  }, [reset]);

  const updatePlayer = async (
    data: FormData,
    playerId: string,
    accessToken: string
  ) => {
    // Implement the logic to update an existing player
    // Use an appropriate API method, for example PUT or PATCH
    // This is a placeholder function, replace with actual API call
    console.log("Updating player", playerId, "with data", data);
    // await updatePlayerAPI(playerId, data, accessToken);
  };

  const onSubmit = async (data: any) => {
    try {
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

      const competeId = localStorage.getItem("selectedCompetitionId");

      const newAccessToken = await verifyTokenExpiration(
        currentUser.accessToken,
        currentUser.refreshToken
      );

      if (newAccessToken) {
        if (isEditing) {
          await updatePlayer(formData, params.id, newAccessToken);
          toast("The player has been successfully updated.");
        } else {
          await createPlayer(
            currentUser.accessToken,
            currentUser.isManageTeam,
            formData,
            competeId
          );
          toast("The player has been successfully created.");
        }
        localStorage.removeItem("formData");
        reset({});
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setError("Failed to refresh access token");
      }
    } catch (error: any) {
      setError(error.message);
      toast(`${error.message}`);
    }
  };

  return isLoading ? (
    <div className="h-screen w-full flex justify-center items-center">
      <LoadingSpinner text="Loading..." />
    </div>
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="pt-10 pb-14 px-5 flex flex-col space-y-6 container mx-auto md:justify-center"
    >
      <DynamicBreadcrumbs paths={breadcrumbPaths} />
      <div className="flex flex-col space-y-8">
        <div className="w-full flex flex-col justify-center items-center md:flex md:flex-row md:justify-normal gap-3">
          <div className="flex flex-col space-y-2">
            <Dropzone
              type="image"
              setValue={setValue}
              attribute="playerImage"
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
                <Badge variant="outline" className="w-fit py-3 px-6">
                  Player Status
                </Badge>
                <Button variant="tableDispositionBtn" className="border shadow">
                  <Pencil size={16} />
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Editinput
                id="firstName"
                label="First Name"
                placeholder="Enter first name"
                register={register("firstName")}
                errorMessage={errors.firstName?.message as string}
              />
              <Editinput
                id="lastName"
                label="Last Name"
                placeholder="Enter last name"
                register={register("lastName")}
                errorMessage={errors.lastName?.message as string}
              />
              <Editinput
                id="dorseyNumber"
                label="Dorsey Number"
                placeholder="Enter dorsey number"
                register={register("dorseyNumber", { valueAsNumber: true })}
                errorMessage={errors.dorseyNumber?.message as string}
                type="number"
              />
              <Editinput
                id="college"
                label="College"
                placeholder="Enter college"
                register={register("college")}
                errorMessage={errors.college?.message as string}
              />
              <Editinput
                id="nationality"
                label="Nationality"
                placeholder="Enter nationality"
                register={register("nationality")}
                errorMessage={errors.nationality?.message as string}
              />
              <Editinput
                id="playerEmail"
                label="Email"
                placeholder="Enter email"
                register={register("playerEmail")}
                errorMessage={errors.playerEmail?.message as string}
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
            errorMessage={errors.birthdate?.message as string}
          />
          <Editinput
            id="countryCode"
            label="Country Code"
            placeholder="+229"
            register={register("countryCode")}
            errorMessage={errors.countryCode?.message as string}
          />
          <Editinput
            id="phoneNumber"
            label="Phone Number"
            placeholder="96000000"
            register={register("phoneNumber", { valueAsNumber: true })}
            type="number"
            errorMessage={errors.phoneNumber?.message as string}
          />
          <Editinput
            id="yearOfExperience"
            label="Years of Experience"
            placeholder="1"
            register={register("yearOfExperience", { valueAsNumber: true })}
            type="number"
            errorMessage={errors.yearOfExperience?.message as string}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="w-full flex flex-col space-y-2">
            <label
              htmlFor="position"
              className="text-sm font-medium text-gray-700"
            >
              Position
            </label>
            <Select
              onValueChange={(value) => setValue("position", value)}
              value={position}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select a position for this player" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.position && (
              <span className="text-red-600 text-sm">
                {errors.position.message}
              </span>
            )}
          </div>
          <Editinput
            id="height"
            label="Height"
            placeholder="Enter height"
            type="number"
            register={register("height", { valueAsNumber: true })}
            errorMessage={errors.height?.message as string}
          />
          <Editinput
            id="weight"
            label="Weight"
            placeholder="Enter weight"
            type="number"
            register={register("weight", { valueAsNumber: true })}
            errorMessage={errors.weight?.message as string}
          />
        </div>
        <div className="w-full flex flex-col">
          <div className="w-full md:w-1/2 gap-3">
            <span className="font-semibold">Documents</span>
            <p className="py-4 md:w-[80%]">
              Upload the secure birth certificate of the player to be registered
              on the platform. The validity of the birth certificate will be
              verified within 24 hours and will lead to the activation of the
              player&apos;s profile.
            </p>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-1/2 flex flex-col space-y-2">
              <span>Birth certificate</span>

              {!isEditing && (
                <div>
                  <Dropzone
                    type="file"
                    setValue={setValue}
                    attribute="birthCertificate"
                  />
                  {errors.birthCertificate && (
                    <p className="text-red-500 text-sm">
                      {errors.birthCertificate.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col space-y-2">
              <span>CIP certificate</span>
              {!isEditing && (
                <div>
                  <Dropzone
                    type="file"
                    setValue={setValue}
                    attribute="cipFile"
                  />
                  {errors.cipFile && (
                    <p className="text-red-500 text-sm">
                      {errors.cipFile.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button type="submit" variant="default" className="w-full md:w-1/4">
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
  );
}
