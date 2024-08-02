import axios from "axios";

const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function getDivisions(
  selectedCompetitionId: string,
  gender: string
) {
  try {
    const response = await axios.get(
      `${baseUrl}/divisions/category/${gender}`,
      {
        headers: {
          "x-competition-id": selectedCompetitionId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch divisions", error);
    throw new Error("Failed to fetch divisions");
  }
}
