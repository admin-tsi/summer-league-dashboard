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
import { CalendarIcon, Clock } from "lucide-react";
import { MatchType, Schedule } from "@/lib/types/schedules/schedules";
import { useCurrentToken } from "@/hooks/use-current-token";
import { toast } from "sonner";
import { createSchedule, getAllSchedules } from "@/lib/api/schedules/schedules";
import { getAllKobeBryant } from "@/lib/api/users/users";
import { User } from "@/lib/types/login/user";
import { getAllTeams } from "@/lib/api/teams/teams";
import { Teams } from "@/lib/types/teams/teams";
import LoadingSpinner from "@/components/loading-spinner";
import ScheduleList from "@/components/schedules/view/ScheduleList";

export default function Page() {
  const token = useCurrentToken();
  const [scoreboardOfficers, setScoreboardOfficers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Teams[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("boys");
  const filteredTeams = teams.filter(
    (team) => team.teamGender === selectedGender,
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchedules = async (competitionId: string) => {
    try {
      const fetchedSchedules = await getAllSchedules(token, competitionId);
      setSchedules(fetchedSchedules);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
      toast.error("Failed to load schedules");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const officers = await getAllKobeBryant(token);
        setScoreboardOfficers(officers);

        const competitionId = localStorage.getItem("selectedCompetitionId");
        if (competitionId) {
          const fetchedTeams = await getAllTeams(token, competitionId);
          setTeams(fetchedTeams);

          await fetchSchedules(competitionId);
        } else {
          toast.error("No competition selected");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
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
      const matchType = schedule.match_type || "Other";
      const date = new Date(schedule.date).toDateString();
      if (!acc[matchType]) {
        acc[matchType] = {};
      }
      if (!acc[matchType][date]) {
        acc[matchType][date] = [];
      }
      acc[matchType][date].push(schedule);
      return acc;
    },
    {} as Record<string, Record<string, Schedule[]>>,
  );

  const onSubmit: SubmitHandler<Omit<Schedule, "_id">> = async (data) => {
    setIsLoading(true);
    try {
      const scheduleData = {
        ...data,
      };
      const competitionId = localStorage.getItem("selectedCompetitionId");
      await createSchedule(token, scheduleData, competitionId);

      toast.success("Schedule has been created successfully.");

      if (competitionId) {
        await fetchSchedules(competitionId);
      }
      form.reset();
    } catch (error) {
      console.error("Failed to create schedule:", error);
      toast.error("An error occurred while creating the schedule.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentLayout title="Schedules">
      <div className="container mx-auto px-4 pb-8">
        <DynamicBreadcrumbs paths={breadcrumbPaths} />
        <div className="flex flex-col lg:flex-row gap-6 py-2">
          <div className="w-full lg:w-1/3">
            <Card className="shadow-lg border-t-8 mb-6 lg:mb-0">
              <CardHeader className="text-foreground rounded-t-lg">
                <CardTitle className="text-xl lg:text-2xl font-bold">
                  Add Event
                </CardTitle>
                <CardDescription>
                  Add a new match to the schedule.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 lg:space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <SelectTrigger>
                                  <SelectValue placeholder="Select match type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="division">
                                  Division
                                </SelectItem>
                                <SelectItem value="conference">
                                  Conference
                                </SelectItem>
                                <SelectItem value="playoffs">
                                  Playoffs
                                </SelectItem>
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
                                <SelectTrigger>
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
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Date
                            </FormLabel>
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
                        name="stadiumLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Stadium Location
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Add Stadium Location"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                  className="pl-10"
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
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="boys">Boys</SelectItem>
                          <SelectItem value="girls">Girls</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <SelectTrigger>
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
                                <SelectTrigger>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <SelectTrigger>
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
                                <SelectTrigger>
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
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <LoadingSpinner text="Saving..." />
                      ) : (
                        "Save Schedule"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="w-full lg:w-2/3">
            <div className="bg-secondary rounded-lg shadow-lg overflow-auto">
              <ScheduleList
                groupedSchedules={groupedSchedules}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
