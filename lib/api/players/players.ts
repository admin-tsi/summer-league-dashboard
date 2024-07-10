import axios from "axios";
import { Player } from "@/lib/types/players/players";

export async function getAllPlayers(
  token: string | undefined,
): Promise<Player[]> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

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
          "An error occurred while fetching players",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function getPlayerById(
  playerId: string,
  token: string | undefined,
): Promise<Player> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

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
          "An error occurred while fetching player by ID",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function updatePlayer(
  playerId: string,
  player: Player,
  token: string | undefined,
): Promise<Player> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

  try {
    const response = await axios.patch<Player>(
      `${baseUrl}/players/${playerId}`,
      player,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message ||
          "An error occurred while updating player",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function deletePlayer(
  playerId: string,
  token: string | undefined,
): Promise<void> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

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
          "An error occurred while deleting player",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}
