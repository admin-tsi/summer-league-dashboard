"use client";
import { useEffect } from "react";
import Dropzone from "@/components/player/edit/dragzone";
import Editinput from "@/components/player/edit/input";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { playerSchema } from "@/schemas/playerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export default function Page({
  params,
}: {
  params: { id: string; token: string };
}) {
  type Formfields = z.infer<typeof playerSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<Formfields>({
    resolver: zodResolver(playerSchema),
  });

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

  const submit = async (data: Formfields) => {
    console.log("hi");
    console.log(data);
    localStorage.removeItem("formData");
    reset({});
  };

  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Players", href: "/players" },
    { label: params.id === "New" ? "New Player" : `${params.id}` },
  ];

  return (
    <form
      onSubmit={handleSubmit(submit)}
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
                register={register("dorseyNumber")}
                errorMessage={errors.dorseyNumber?.message as string}
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
                id="email"
                label="email"
                placeholder="Enter email"
                register={register("email")}
                errorMessage={errors.email?.message as string}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Editinput
            id="fullNumber"
            label="Phone Number"
            placeholder="96000000"
            register={register("fullNumber")}
            errorMessage={errors.fullNumber?.message as string}
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
          <Editinput
            id="position"
            label="Position"
            placeholder="Enter position"
            register={register("position")}
            errorMessage={errors.position?.message as string}
          />
          <Editinput
            id="height"
            label="Height"
            placeholder="Enter height"
            register={register("height")}
            errorMessage={errors.height?.message as string}
          />
          <Editinput
            id="weight"
            label="Weight"
            placeholder="Enter weight"
            register={register("weight")}
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
          Save
        </Button>
      </div>
    </form>
  );
}
