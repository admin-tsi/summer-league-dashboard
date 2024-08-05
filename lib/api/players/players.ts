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
    //console.error("Failed to create player:", error.message);
    console.log(error);

    throw error;
  }
};

export async function getAllPlayers(
  token: string | undefined
): Promise<Player[]> {
  try {
    const response = await axios.get<Player[]>(`${baseUrl}/players`, {
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
          "An error occurred while fetching players"
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

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
    console.log(response.data);
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

export async function updatePlayer(
  playerId: string,
  player: Player,
  token: string | undefined
): Promise<Player> {
  try {
    const response = await axios.patch<Player>(
      `${baseUrl}/players/${playerId}`,
      player,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message ||
          "An error occurred while updating player"
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

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
