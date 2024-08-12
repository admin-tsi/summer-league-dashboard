"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { CalendarIcon, Clock } from "lucide-react"; // Import icons

export default function Page() {
  const breadcrumbPaths = [
    { label: "Management", href: "/" },
    { label: "Schedules" },
  ];

  const form = useForm({
    defaultValues: {
      matchType: "",
      division: "",
      notes: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      teamA: "",
      teamB: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <ContentLayout title="Schedules">
      <DynamicBreadcrumbs paths={breadcrumbPaths} />
      <div className="grid grid-cols-3 gap-6 h-screen pt-4">
        <div className="col-span-1 h-full w-full">
          <Card className="w-full h-full shadow-lg border-t-8">
            <CardHeader className="text-foreground rounded-t-lg">
              <CardTitle className="text-2xl font-bold">Add Event</CardTitle>
              <CardDescription>
                Add a new match to the schedule.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="matchType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Match Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select match type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="friendly">Friendly</SelectItem>
                              <SelectItem value="league">League</SelectItem>
                              <SelectItem value="cup">Cup</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="division"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Division
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select division" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="premier">
                                Premier League
                              </SelectItem>
                              <SelectItem value="championship">
                                Championship
                              </SelectItem>
                              <SelectItem value="league1">
                                League One
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type the note here..."
                            className=" min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <Input
                                type="date"
                                className=" pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Start Time
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <Input
                                  type="time"
                                  className=" pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              End Time
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <Input
                                  type="time"
                                  className=" pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Add Location"
                            className=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="teamA"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Team A
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select Team A" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="teamA1">Team A1</SelectItem>
                              <SelectItem value="teamA2">Team A2</SelectItem>
                              <SelectItem value="teamA3">Team A3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="teamB"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Team B
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select Team B" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="teamB1">Team B1</SelectItem>
                              <SelectItem value="teamB2">Team B2</SelectItem>
                              <SelectItem value="teamB3">Team B3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary-yellow hover:bg-primary-yellow-dark text-white font-bold py-3 rounded-lg transition duration-300"
                  >
                    Save Schedule
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2 h-full bg-secondary w-full rounded-lg shadow-lg"></div>
      </div>
    </ContentLayout>
  );
}
