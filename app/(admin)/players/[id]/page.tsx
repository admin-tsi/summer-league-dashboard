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
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types/login/user";
import LoadingSpinner from "@/components/loading-spinner";
import CustomBreadcrumb from "@/components/custom-breadcumb";
import { getUserById, updateUser } from "@/lib/api/users/users";
import { UserSchema } from "@/lib/schemas/users/users";
import { formatDate } from "@/lib/utils";

type UserFormData = z.infer<typeof UserSchema>;

export default function Page({
  params,
}: {
  params: { id: string; token: string };
}) {
  const token = useCurrentToken();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const form = useForm<UserFormData>({
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

  const { setValue, handleSubmit } = form;

  useEffect(() => {
    setIsLoading(true);
    getUserById(params.id, token)
      .then((data) => {
        setUser(data);
        Object.keys(data).forEach((key) => {
          if (key in form.getValues()) {
            setValue(key as keyof UserFormData, data[key as keyof User] ?? "");
          }
        });
      })
      .catch((error) => {
        console.error("Failed to fetch user", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id, token, setValue, form]);

  const onSubmit = async (data: UserFormData) => {
    console.log("Form Submitted:", data);
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
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-12">
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="phoneNumber">Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="phoneNumber"
                        placeholder="Phone"
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dateOfBirth"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="dateOfBirth"
                        placeholder="Date of Birth"
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={formatDate(field.value)}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="role"
                control={form.control}
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
                control={form.control}
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
                name="countryCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
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
                name="address"
                control={form.control}
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
                <Button type="submit" variant="outline" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner text="Saving..." /> : "Save"}
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
