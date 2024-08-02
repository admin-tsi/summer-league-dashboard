import axios from "axios";

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
    throw new Error("Failed to create team");
  }
}
