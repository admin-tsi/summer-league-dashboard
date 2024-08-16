"use client";

import React, { useEffect, useState } from "react";
import { useCurrentToken } from "@/hooks/use-current-token";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types/login/user";
import LoadingSpinner from "@/components/loading-spinner";
import { getUserById, updateUser } from "@/lib/api/users/users";
import { UserSchema } from "@/lib/schemas/users/users";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryCodes } from "@/constants/data/country-codes";
import { RoleBadge } from "@/components/users/role-badge";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";

type UserFormData = z.infer<typeof UserSchema>;

export default function Page({
  params,
}: {
  params: { id: string; token: string };
}) {
  const token = useCurrentToken();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      specialization: "",
      countryCode: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
    },
  });

  const { setValue, handleSubmit, watch, control } = form;

  useEffect(() => {
    setIsLoading(true);
    getUserById(params.id, token)
      .then((data) => {
        setUser(data);
        Object.keys(data).forEach((key) => {
          if (key === "dateOfBirth" && data[key]) {
            const date = new Date(data[key]);
            const formattedDate = date.toISOString().split("T")[0];
            setValue(key as keyof UserFormData, formattedDate);
          } else {
            setValue(key as keyof UserFormData, data[key as keyof User] as any);
          }
        });
      })
      .catch((error) => {
        toast.error("Failed to fetch user");
        console.error("Failed to fetch user", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id, token, setValue]);

  const onSubmit = async (data: UserFormData) => {
    setIsSaving(true);
    try {
      await updateUser(params.id, data, token);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Failed to update user", error);
    } finally {
      setIsSaving(false);
    }
  };

  const dateOfBirth = watch("dateOfBirth");

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  const breadcrumbPaths = [
    { label: "Settings", href: "/users" },
    { label: "Users", href: "/users" },
    { label: user?.email || "" },
  ];

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-12">
        <DynamicBreadcrumbs paths={breadcrumbPaths} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user && (
            <>
              <FormField
                name="firstName"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="firstName"
                        placeholder="First Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastName"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} id="lastName" placeholder="Last Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input {...field} id="email" placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-1 md:col-span-2 flex space-x-4">
                <FormField
                  name="countryCode"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex-shrink-0 w-1/3">
                      <FormLabel htmlFor="countryCode" className="truncate">
                        Code
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem
                              key={country.code + country.country}
                              value={country.code}
                            >
                              {country.country} ({country.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="phoneNumber"
                          placeholder="Phone Number"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        id="dateOfBirth"
                        placeholder="Date of Birth"
                        max={new Date().toISOString().split("T")[0]}
                        value={dateOfBirth || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="role"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="role">Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">
                          <RoleBadge role="admin" />
                        </SelectItem>
                        <SelectItem value="user">
                          <RoleBadge role="user" />
                        </SelectItem>
                        <SelectItem value="team-manager">
                          <RoleBadge role="team-manager" />
                        </SelectItem>
                        <SelectItem value="kobe-bryant">
                          <RoleBadge role="kobe-bryant" />
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="specialization"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="specialization">
                      Specialization
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="specialization"
                        placeholder="Specialization"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <FormControl>
                      <Input {...field} id="address" placeholder="Address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-1 md:col-span-2 flex justify-center">
                <Button
                  type="submit"
                  variant="default"
                  disabled={isSaving}
                  size={"lg"}
                >
                  {isSaving ? (
                    <>
                      <LoadingSpinner text={"Saving..."} />
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
