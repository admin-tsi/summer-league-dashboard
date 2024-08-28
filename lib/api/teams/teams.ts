import axios, { AxiosResponse } from "axios";
import { GameStats, Teams } from "@/lib/types/teams/teams";

const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function createTeam(
  data: any,
  token: string,
  competitionId: string
) {
  try {
    const response = await axios.post(`${baseUrl}/teams`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-competition-id": competitionId,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create team", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `${error.response.data.message || error.response.statusText}`
      );
    } else {
      throw new Error("Failed to create team: Network or server error");
    }
  }
}

export async function getAllTeams(
  token: string | undefined,
  competitionId: string
): Promise<Teams[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  try {
    const response = await axios.get(`${baseUrl}/teams`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-competition-id": competitionId,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get teams", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `${error.response.data.message || error.response.statusText}`
      );
    } else {
      throw new Error("Failed to get teams: Network or server error");
    }
  }
}

export async function getTeamById(
  competitionId: string | null,
  teamId: string,
  token: string
): Promise<any> {
  const url: string = `${baseUrl}/teams/${teamId}`;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-competition-id": competitionId,
    },
  };

  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `${error.response.data.message || error.response.statusText}`
      );
    } else {
      throw new Error("Failed to create team: Network or server error");
    }
  }
}

export async function getTeamKpi(
  competitionId: string | null,
  teamId: string
): Promise<GameStats> {
  const url: string = `${baseUrl}/teams-stats/team/${teamId}/kpi`;

  const config = {
    headers: {
      "x-competition-id": competitionId,
    },
  };

  return axios
    .get(url, config)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: any) => {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `${error.response.data.message || error.response.statusText}`
        );
      } else {
        throw new Error("Failed to get team kpi: Network or server error");
      }
    });
}
