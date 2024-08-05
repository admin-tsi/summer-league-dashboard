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
import { createPlayer } from "@/lib/api/players/players";
import { playerSchema } from "@/schemas/playerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Page({
  params,
}: {
  params: { id: string; token: string };
}) {
  type Formfields = z.infer<typeof playerSchema>;
  const currentUser: any = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<Formfields>({
    resolver: zodResolver(playerSchema),
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

  const onSubmit = async (data: any) => {
    try {
      console.log(data);

      const formData = new FormData();

      for (const key in data) {
        if (data[key] instanceof FileList) {
          Array.from(data[key]).forEach((file) => {
            formData.append(key, file);
          });
        } else if (data[key] instanceof File) {
          formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }

      const competeId = localStorage.getItem("selectedCompetitionId");

      const newAccessToken = await verifyTokenExpiration(
        currentUser.accessToken,
        currentUser.refreshToken
      );

      console.log("old :", currentUser.accessToken);
      console.log("new :", newAccessToken);

      if (newAccessToken) {
        const newPlayer = await createPlayer(
          currentUser.accessToken,
          currentUser.isManageTeam,
          formData,
          competeId
        );
        console.log("Player created successfully:", newPlayer);
      } else {
        setError("Failed to refresh access token");
      }
    } catch (error: any) {
      console.error("Error creating player:", error);
      setError(error.message);
    }
  };

  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Players", href: "/players" },
    { label: params.id === "New" ? "New Player" : `${params.id}` },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="pt-10 pb-14 px-5 flex flex-col space-y-6 container mx-auto md:justify-center"
    >
      <DynamicBreadcrumbs paths={breadcrumbPaths} />
      <div className="flex flex-col space-y-3">
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
            {params.id != "New" && (
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
                label="email"
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
            id="yearsOfExperience"
            label="Years of Experience"
            placeholder="1 years"
            register={register("yearsOfExperience")}
            errorMessage={errors.yearsOfExperience?.message as string}
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
              <Dropzone
                type="file"
                setValue={setValue}
                attribute="birthCertificate"
              />
              {errors.birthCertificate && (
                <p>{errors.birthCertificate.message}</p>
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col space-y-2">
              <span>CIP certificate</span>
              <Dropzone type="file" setValue={setValue} attribute="cipFile" />
              {errors.cipFile && <p>{errors.cipFile.message}</p>}
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
            <span>Create my player</span>
          )}
        </Button>
      </div>
      {error && (
        <div className="w-full flex justify-center items-center">
          <span className="text-sm text-red-500 text-center">{error}</span>
        </div>
      )}
    </form>
  );
}
