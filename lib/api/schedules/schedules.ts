import axios, { AxiosResponse } from "axios";
import { Game, Schedule } from "@/lib/types/schedules/schedules";

const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function createSchedule(
  token: string | undefined,
  data: Omit<Schedule, "_id">,
  competitionId: string | null
): Promise<void> {
  try {
    const apiData = {
      ...data,
      date: data.date.toISOString(),
    };

    await axios.post(`${baseUrl}/schedules`, apiData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-competition-id": competitionId,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message ||
          "An error occurred while creating the schedule"
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function getTeamSchedules(teamId: string): Promise<Game[]> {
  const url: string = `${baseUrl}/schedules/team/${teamId}`;

  return axios
    .get(url)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: any) => {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `${error.response.data.message || error.response.statusText}`
        );
      } else {
        throw new Error("Failed to get schedule: Network or server error");
      }
    });
}
