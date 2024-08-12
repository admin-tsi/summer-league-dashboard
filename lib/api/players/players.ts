import { Player } from "@/lib/types/players/players";
import axios from "axios";

const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

export const createPlayer = async (
  token: string,
  teamId: string,
  formData: FormData,
  competitionId: string | null
) => {
  try {
    if (!teamId) {
      throw new Error(
        "You are not managing any team for the summer league. Go to your dashboard and create your team to be able to start creating players. If any problem occurs while creating your team, please contact us."
      );
    }
    console.log("FormData entries:", Array.from(formData.entries()));
    const response = await axios.post(
      `${baseUrl}/players/teams/${teamId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          "x-competition-id": competitionId,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export async function getAllPlayers(
  role: "admin" | "team-manager" | "kobe-bryant",
  token: string | null,
  teamId?: string
): Promise<Player[]> {
  let endpoint: string;

  switch (role) {
    case "admin":
      endpoint = "/players";
      break;
    case "team-manager":
    case "kobe-bryant":
      if (!teamId) {
        throw new Error(
          "TeamId is required for team-manager and kobe-bryant roles"
        );
      }
      endpoint = `/players/specific/teams/${teamId}`;
      break;
    default:
      throw new Error("Invalid role");
  }

  try {
    const { data } = await axios.get<Player[]>(`${baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message ||
          "An error occurred while fetching players"
      );
    }
    throw new Error("A non-Axios error occurred");
  }
}

export const validatePlayerProfile = async (
  token: string,
  playerId: string,
  data: any
) => {
  try {
    const response = await axios.post(
      `${baseUrl}/players/${playerId}/player-verification`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting player data:", error);
    throw error;
  }
};

export async function getPlayerById(
  playerId: string,
  token: string | undefined
): Promise<Player> {
  try {
    const response = await axios.get<Player>(`${baseUrl}/players/${playerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message ||
          "An error occurred while fetching player by ID"
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export const updatePlayer = async (
  updateData: any,
  playerId: string,
  accessToken: string
): Promise<void> => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/players/${playerId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update player data");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "An error occurred while updating the player"
    );
  }
};

export const updatePlayerFiles = async (
  formData: any,
  playerId: string,
  accessToken: string
): Promise<void> => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/players/${playerId}/uploads-files`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update player data");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "An error occurred while updating the player"
    );
  }
};

export async function deletePlayer(
  playerId: string,
  token: string | undefined
): Promise<void> {
  try {
    await axios.delete(`${baseUrl}/players/${playerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message ||
          "An error occurred while deleting player"
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}
