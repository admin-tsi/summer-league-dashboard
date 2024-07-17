"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.svg";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ChangePasswordSchema } from "@/schemas";
import * as z from "zod";
import FormError from "@/components/login/form-error";
import FormSuccess from "@/components/login/form-success";
import LoadingSpinner from "@/components/loading-spinner";
import { changePassword } from "@/lib/api/auth/changePassword";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    startTransition(() => {
      changePassword({
        code: values.code,
        password: values.newPassword,
      }).then((response) => {
        if (response && response.success) {
          setError("");
          setSuccess(response.message);
          router.push("/login");
        } else if (response && response.error) {
          setError(response.message);
          setSuccess("");
        } else {
          console.error("No response from changePassword function.");
        }
      });
    });
  };

  return (
    <main className="fixed inset-0 bg-background flex items-center justify-center">
      <Card className="w-full h-full sm:max-w-sm sm:h-auto sm:rounded-lg bg-muted">
        <CardHeader>
          <Link
            href="/public"
            className="block h-full w-16 mx-auto sm:mx-0 sm:mr-4 "
          >
            <Image
              src={logo}
              alt="AWSP Logo"
              layout="responsive"
              width={72}
              height={64}
            />
          </Link>
          <CardTitle className="text-2xl text-center sm:text-left">
            Change Password
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter your new password below to change your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="code">Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          type="text"
                          placeholder="Enter code"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                ></FormField>
                <FormField
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="newPassword">New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            disabled={isPending}
                            type={showNewPassword ? "text" : "password"}
                            placeholder="********"
                            required
                          />
                          <button
                            type="button"
                            onClick={toggleNewPasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          >
                            {showNewPassword ? "👁️" : "👁️‍🗨️"}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                ></FormField>
                <FormField
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            disabled={isPending}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="********"
                            required
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          >
                            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                ></FormField>
              </div>
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button
                type="submit"
                variant="outline"
                className={`w-full ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <LoadingSpinner text="Loading..." />
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
