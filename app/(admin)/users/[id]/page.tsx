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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types/login/user";
import LoadingSpinner from "@/components/loading-spinner";
import CustomBreadcrumb from "@/components/custom-breadcumb";
import { getUserById, updateUser } from "@/lib/api/users/users";
import { UserSchema } from "@/lib/schemas/users/users";

type UserFormData = z.infer<typeof UserSchema>;

export default function Page({
  params,
}: {
  params: { id: string; token: string };
}) {
  const token = useCurrentToken();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const methods = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      createdAt: "",
      updatedAt: "",
      specialization: "",
      countryCode: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
    },
  });

  const { setValue, handleSubmit, watch } = methods;

  useEffect(() => {
    setIsLoading(true);
    getUserById(params.id, token)
      .then((data) => {
        setUser(data);
        Object.keys(data).forEach((key) => {
          if (key in methods.getValues()) {
            const value = data[key as keyof User];

            setValue(key as keyof UserFormData, value ?? "");
          }
        });
      })
      .catch((error) => {
        console.error("Failed to fetch user", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id, token, setValue, methods]);

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      await updateUser(params.id, data, token);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="w-full mx-auto p-12" onSubmit={handleSubmit(onSubmit)}>
        <CustomBreadcrumb />
        {isLoading && (
          <div className="w-full flex justify-center items-center">
            <LoadingSpinner text="Loading..." />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!isLoading && user && (
            <>
              <FormField
                name="firstName"
                control={methods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="firstName"
                        placeholder="First Name"
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastName"
                control={methods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="lastName"
                        placeholder="Last Name"
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={methods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        placeholder="Email"
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-1 md:col-span-2 flex gap-4">
                <FormField
                  name="countryCode"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel htmlFor="countryCode">Country Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="countryCode"
                          placeholder="Country Code"
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phoneNumber"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="phoneNumber"
                          placeholder="Phone Number"
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                name="dateOfBirth"
                control={methods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        id="dateOfBirth"
                        placeholder="Date of Birth"
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="role"
                control={methods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="role">Role</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="role"
                        placeholder="Role"
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="specialization"
                control={methods.control}
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
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={methods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="address"
                        placeholder="Address"
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-1 md:col-span-2 flex justify-center">
                <Button type="submit" className="mt-4 w-1/3">
                  Save
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
