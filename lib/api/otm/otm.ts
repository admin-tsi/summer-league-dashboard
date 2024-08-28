import axios, { AxiosResponse } from "axios";

const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function getOtmSchedules(
  competitionId: string,
  otmId: string,
  token: string,
): Promise<any> {
  const url: string = `${baseUrl}/kb-stats/otm/schedules/${otmId}`;

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
        `${error.response.data.message || error.response.statusText}`,
      );
    } else {
      throw new Error("Failed to create team: Network or server error");
    }
  }
}

export async function saveOtmScheduleStat(
  competitionId: string,
  scheduleId: string,
  token: string,
  data: any,
): Promise<any> {
  const url: string = `${baseUrl}/kb-stats/schedules/${scheduleId}`;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-competition-id": competitionId,
    },
  };

  return axios
    .post(url, data, config)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: any) => {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `${error.response.data.message || error.response.statusText}`,
        );
      } else {
        throw new Error("Failed to create team: Network or server error");
      }
    });
}
