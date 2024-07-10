import axios from "axios";
import { Competition } from "@/lib/types/competitions/competitions";

export async function getAllCompetitions(
  token: string | undefined,
): Promise<Competition[]> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

  try {
    const response = await axios.get<Competition[]>(`${baseUrl}/competitions`, {
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
          "An error occurred while fetching competitions",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}
