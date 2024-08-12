"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { AskChangePassword } from "@/lib/api/auth/changePassword";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loading-spinner"; // Import useRouter

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Initialize the router

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    startTransition(() => {
      AskChangePassword({ email: values.email })
        .then((response) => {
          if (response && !response.success) {
            setError(response.message);
            setSuccess("");
          } else if (response) {
            setError("");
            setSuccess(response.message);
            router.push("/change-password");
          }
        })
        .catch((err) => {
          console.error("Error in password reset request:", err);
          setError("An error occurred while processing your request.");
          setSuccess("");
        });
    });
  };

  return (
    <main className="fixed inset-0 bg-background flex items-center justify-center">
      <Card className="w-full h-full sm:max-w-sm sm:h-auto sm:rounded-lg bg-muted">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="email"
                control={form.control}
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
              />
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button
                type="submit"
                variant="outline"
                className={`w-full ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isPending}
              >
                {isPending ? (
                  <LoadingSpinner text="Submitting..." />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
