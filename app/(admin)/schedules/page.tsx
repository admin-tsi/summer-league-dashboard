"use client";
import React from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
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
import { CalendarIcon, Clock } from "lucide-react";
import { MatchType, Schedule } from "@/lib/types/schedules/schedules";
import { useCurrentToken } from "@/hooks/use-current-token";
import { toast } from "sonner";
import { createSchedule } from "@/lib/api/schedules/schedules";
import { teamNames } from "@/constants/team/teams";

export default function Page() {
  const token = useCurrentToken();

  const breadcrumbPaths = [
    { label: "Management", href: "/" },
    { label: "Schedules" },
  ];

  const form = useForm<Omit<Schedule, "_id">>({
    defaultValues: {
      match_type: "" as MatchType,
      division: "",
      notes: "",
      date: new Date(),
      hour: "6h30",
      homeTeam: "",
      awayTeam: "",
      stadiumLocation: "",
      conference: "",
      homeScoreboardOfficier: "-",
      awayScoreboardOfficier: "-",
    },
  });

  const matchType = form.watch("match_type");
  const homeTeam = useWatch({ control: form.control, name: "homeTeam" });
  const awayTeam = useWatch({ control: form.control, name: "awayTeam" });
  const getDivisionOptions = (matchType: MatchType): string[] => {
    switch (matchType) {
      case "division":
        return ["Sin", "Mion", "Djo & Ayi"];
      case "conference":
        return ["Hwé", "Sun"];
      case "playoffs":
        return ["Quarterfinals", "Semifinals"];
      case "final":
        return ["Final"];
      default:
        return [];
    }
  };

  const onSubmit: SubmitHandler<Omit<Schedule, "_id">> = async (data) => {
    try {
      const scheduleData = {
        ...data,
      };
      const competitionId = localStorage.getItem("selectedCompetitionId");
      await createSchedule(token, scheduleData, competitionId);

      toast.success("Schedule has been created successfully.");
    } catch (error) {
      console.error("Failed to create schedule:", error);
      toast.error("An error occurred while creating the schedule.");
    }
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
                      name="match_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Match Type
                          </FormLabel>
                          <Select
                            onValueChange={(value: MatchType) => {
                              field.onChange(value);
                              form.setValue("division", "");
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select match type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="division">Division</SelectItem>
                              <SelectItem value="conference">
                                Conference
                              </SelectItem>
                              <SelectItem value="playoffs">Playoffs</SelectItem>
                              <SelectItem value="final">Final</SelectItem>
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select division" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getDivisionOptions(matchType).map((option) => (
                                <SelectItem
                                  key={option}
                                  value={option.toLowerCase()}
                                >
                                  {option}
                                </SelectItem>
                              ))}
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
                                className="pl-10"
                                value={
                                  field.value instanceof Date
                                    ? field.value.toISOString().split("T")[0]
                                    : ""
                                }
                                onChange={(e) => {
                                  const date = new Date(e.target.value);
                                  field.onChange(date);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hour"
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
                  </div>

                  <FormField
                    control={form.control}
                    name="stadiumLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Stadium Location
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Add Stadium Location"
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
                      name="homeTeam"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Home Team
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (value === awayTeam) {
                                form.setValue("awayTeam", "");
                              }
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select Home Team" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teamNames.map((team) => (
                                <SelectItem key={team} value={team}>
                                  {team}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="awayTeam"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Away Team
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (value === homeTeam) {
                                form.setValue("homeTeam", "");
                              }
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select Away Team" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teamNames
                                .filter((team) => team !== homeTeam)
                                .map((team) => (
                                  <SelectItem key={team} value={team}>
                                    {team}
                                  </SelectItem>
                                ))}
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
