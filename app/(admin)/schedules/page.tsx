"use client";
import React, { useEffect, useState } from "react";
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
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { MatchType, Schedule } from "@/lib/types/schedules/schedules";
import { useCurrentToken } from "@/hooks/use-current-token";
import { toast } from "sonner";
import { createSchedule, getAllSchedules } from "@/lib/api/schedules/schedules";
import { getAllKobeBryant } from "@/lib/api/users/users";
import { User } from "@/lib/types/login/user";
import { getAllTeams } from "@/lib/api/teams/teams";
import { Teams } from "@/lib/types/teams/teams";

export default function Page() {
  const token = useCurrentToken();
  const [scoreboardOfficers, setScoreboardOfficers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Teams[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("boys");
  const filteredTeams = teams.filter(
    (team) => team.teamGender === selectedGender,
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const officers = await getAllKobeBryant(token);
        setScoreboardOfficers(officers);

        const competitionId = localStorage.getItem("selectedCompetitionId");
        if (competitionId) {
          const fetchedTeams = await getAllTeams(token, competitionId);
          setTeams(fetchedTeams);

          const fetchedSchedules = await getAllSchedules(token, competitionId);
          setSchedules(fetchedSchedules);
        } else {
          toast.error("No competition selected");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, [token]);

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
      homeTeam: "",
      awayTeam: "",
      stadiumLocation: "",
      conference: "",
      homeScoreboardOfficier: "",
      awayScoreboardOfficier: "",
      startTime: "",
      endTime: "",
    },
  });

  const matchType = form.watch("match_type");
  const homeTeam = useWatch({ control: form.control, name: "homeTeam" });
  const awayTeam = useWatch({ control: form.control, name: "awayTeam" });
  const homeScoreboardOfficier = useWatch({
    control: form.control,
    name: "homeScoreboardOfficier",
  });
  const awayScoreboardOfficier = useWatch({
    control: form.control,
    name: "awayScoreboardOfficier",
  });

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

  const groupedSchedules = schedules.reduce(
    (acc, schedule) => {
      const date = new Date(schedule.date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(schedule);
      return acc;
    },
    {} as Record<string, Schedule[]>,
  );

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

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "not started":
        return "bg-yellow-400";
      case "finish":
        return "bg-red-500";
      case "pending":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };
  const getTeamInfo = (team: any) => {
    if (typeof team === "object" && team !== null) {
      return {
        name: team.teamName || "Unknown Team",
        gender: team.teamGender || "U",
      };
    }
    return { name: "Unknown Team", gender: "U" };
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

                  <div className="w-1/2">
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                              <Input type="time" className="pl-10" {...field} />
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
                              <Input type="time" className="pl-10" {...field} />
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
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Select Gender
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        setSelectedGender(value);
                        form.setValue("homeTeam", "");
                        form.setValue("awayTeam", "");
                      }}
                      value={selectedGender}
                    >
                      <FormControl>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="boys">Boys</SelectItem>
                        <SelectItem value="girls">Girls</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>

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
                            disabled={!selectedGender}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select Home Team" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredTeams.map((team) => (
                                <SelectItem key={team._id} value={team._id}>
                                  {team.teamName}
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
                            disabled={!selectedGender}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select Away Team" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredTeams
                                .filter((team) => team._id !== homeTeam)
                                .map((team) => (
                                  <SelectItem key={team._id} value={team._id}>
                                    {team.teamName}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="homeScoreboardOfficier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Home Scoreboard Officer
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (value === awayScoreboardOfficier) {
                                form.setValue("awayScoreboardOfficier", "");
                              }
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select Home Officer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {scoreboardOfficers.map((officer) => (
                                <SelectItem
                                  key={officer._id}
                                  value={officer._id}
                                >
                                  {`${officer.firstName} ${officer.lastName}`}
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
                      name="awayScoreboardOfficier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Away Scoreboard Officer
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (value === homeScoreboardOfficier) {
                                form.setValue("homeScoreboardOfficier", "");
                              }
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select Away Officer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {scoreboardOfficers
                                .filter(
                                  (officer) =>
                                    officer._id !== homeScoreboardOfficier,
                                )
                                .map((officer) => (
                                  <SelectItem
                                    key={officer._id}
                                    value={officer._id}
                                  >
                                    {`${officer.firstName} ${officer.lastName}`}
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
        <div className="col-span-2 h-full bg-secondary w-full rounded-lg shadow-lg overflow-auto">
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle>Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(groupedSchedules).map(([date, daySchedules]) => (
                <div key={date} className="border mb-4">
                  <div className="bg-black text-white p-2 flex justify-between">
                    <span>
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </span>
                    <span>
                      {new Date(date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="py-2">
                    {daySchedules.map((schedule, scheduleIndex) => {
                      const homeTeam = getTeamInfo(schedule.homeTeam);
                      const awayTeam = getTeamInfo(schedule.awayTeam);
                      return (
                        <div
                          key={scheduleIndex}
                          className="grid grid-cols-12 gap-2 items-center p-2 border-b last:border-b-0 hover:bg-gray-100"
                        >
                          <span className="col-span-2 text-sm">
                            {`${schedule.startTime || schedule.hour} - ${schedule.endTime || ""}`}
                          </span>
                          <span className="col-span-6 font-semibold text-sm">
                            {`${homeTeam.name} (${homeTeam.gender.charAt(0).toUpperCase()}) VS ${awayTeam.name} (${awayTeam.gender.charAt(0).toUpperCase()})`}
                          </span>
                          <span className="col-span-3 text-sm flex items-center">
                            <MapPin size={16} className="mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {schedule.stadiumLocation}
                            </span>
                          </span>
                          <span className="col-span-1 flex justify-center">
                            <span
                              className={`inline-block w-4 h-4 rounded-full ${getStatusColor(schedule.status)}`}
                              title={schedule.status}
                            ></span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  );
}
