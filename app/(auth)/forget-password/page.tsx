"use client";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import LoadingSpinner from "@/components/loading-spinner";
import FormError from "@/components/login/form-error";
import FormSuccess from "@/components/login/form-success";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AskChangePassword } from "@/lib/api/auth/changePassword";
import logo from "@/public/logo.svg";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const forgotPasswordSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .email({ message: "Please enter a valid email address" }),
      }),
    []
  );

  const formOptions = useMemo(
    () => ({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: { email: "" },
    }),
    [forgotPasswordSchema]
  );

  const form = useForm<z.infer<typeof forgotPasswordSchema>>(formOptions);

  const onSubmit = useCallback(
    async (values: z.infer<typeof forgotPasswordSchema>) => {
      setError("");
      setSuccess("");

      setIsPending(true);

      try {
        const response = await AskChangePassword({ email: values.email });

        if (response.success) {
          setSuccess(response.message);

          await new Promise((resolve) => setTimeout(resolve, 4000));

          router.push("/change-password");
        } else {
          setError(
            response.message ||
              "An error occurred while processing your request."
          );
        }
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message
          : "An unexpected error occurred. Please try again.";

        setError(errorMessage);
      } finally {
        setIsPending(false);
      }
    },
    [router]
  );

  return (
    <main className="fixed inset-0 bg-background flex items-center justify-center">
      <Card className="w-full h-full sm:max-w-sm sm:h-auto sm:rounded-lg bg-muted border-none md:shadow-2xl">
        <CardHeader className="space-y-4">
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

          <CardDescription className="text-center sm:text-left">
            Have you forgotten your password ? Enter your e-mail address here to
            start the reset procedure.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        required
                        aria-invalid={fieldState.error ? "true" : "false"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormSuccess message={success} />
              <FormError message={error} />

              <Button
                type="submit"
                variant="outline"
                className="w-full"
                disabled={isPending}
                aria-busy={isPending}
              >
                {isPending ? (
                  <LoadingSpinner text="Submitting..." />
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="w-full text-center">
                <Link href="/login" className="underline">
                  Back to login page
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
