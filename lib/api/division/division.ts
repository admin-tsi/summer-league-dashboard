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
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `${error.response.data.message || error.response.statusText}`
      );
    } else {
      throw new Error("Failed to create team: Network or server error");
    }
  }
}

export async function getSpecDivisionClassment(divisionId: string) {
  try {
    const response = await axios.get(
      `${baseUrl}/divisions-classments/divisions/${divisionId}`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `${error.response.data.message || error.response.statusText}`
      );
    } else {
      throw new Error(
        "Failed to fetch division classement: Network or server error"
      );
    }
  }
}
