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
import * as z from "zod";
import FormError from "@/components/login/form-error";
import FormSuccess from "@/components/login/form-success";
import LoadingSpinner from "@/components/loading-spinner";
import { login } from "@/lib/api/auth/login";
import { Eye, EyeOff } from "lucide-react";
import { LoginSchema } from "@/lib/schemas/auth/login";

export default function Page() {
  const [error, setError] = React.useState<string | undefined>("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values).then((response) => {
        if (response && "error" in response) {
          setError(response.error);
          setSuccess("");
        } else if (response) {
          console.log(response);
          setError("");
          setSuccess(String(response.success));
        } else {
          console.error("No response from login function.");
        }
      });
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            Login
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="john.doe@example.com"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                ></FormField>
                <FormField
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            disabled={isPending}
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            required
                            className="block w-full px-2 h-10 rounded-md border-[1px] text-gray-900 shadow-sm bg-background placeholder:text-gray-400 sm:text-sm focus-visible:outline-none"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-400 hover:bg-transparent"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                ></FormField>
              </div>
              <div className="flex justify-end">
                <Button
                  variant={"link"}
                  className="text-primary p-0 text-right"
                  asChild
                >
                  <Link
                    href="/forget-password"
                    className="text-primary underline"
                  >
                    Forgot password ?
                  </Link>
                </Button>
              </div>
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button
                type="submit"
                variant="outline"
                className={`w-full space-y-0 ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <LoadingSpinner text="Loading..." />
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <div className="text-sm text-center">
                Don&apos;t have an account?
                <Button variant="link" className="text-primary" asChild>
                  <Link
                    href="/register"
                    className="text-primary hover:underline ml-1"
                  >
                    Register
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
