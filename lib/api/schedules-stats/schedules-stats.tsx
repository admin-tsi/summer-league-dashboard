import axios, { AxiosResponse } from "axios";
const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function getAllSchedulesStats(
  competitionId: string,
  token: string
): Promise<any> {
  const url: string = `${baseUrl}/kb-stats/otm/stats/schedules`;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
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
        throw new Error("Failed to get schedule: Network or server error");
      }
    });
}

export async function getDetailedScheduleStats(
  scheduleId: string,
  competitionId: string,
  token: string
): Promise<any> {
  const url: string = `${baseUrl}/kb-stats/schedules/${scheduleId}`;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
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
        throw new Error("Failed to get schedule: Network or server error");
      }
    });
}

export async function deleteSchedulesStats(
  scheduleId: string,
  competitionId: string,
  token: string
): Promise<any> {
  const url: string = `${baseUrl}/kb-stats/otm/stats/schedules`;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
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
        throw new Error("Failed to delete schedule: Network or server error");
      }
    });
}

export async function updateOtmScheduleStat(
  competitionId: string,
  scheduleStatId: string,
  token: string,
  data: any
): Promise<any> {
  const url: string = `${baseUrl}/kb-stats/${scheduleStatId}`;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-competition-id": competitionId,
    },
  };

  return axios
    .patch(url, data, config)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: any) => {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `${error.response.data.message || error.response.statusText}`
        );
      } else {
        throw new Error(
          "Failed to update team schedule stats: Network or server error"
        );
      }
    });
}

export async function deleteOtmScheduleStat(
  competitionId: string,
  scheduleStatId: string,
  token: string,
): Promise<any> {
  const url: string = `${baseUrl}/kb-stats/${scheduleStatId}`;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-competition-id": competitionId,
    },
  };

  return axios
    .delete(url, config)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: any) => {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `${error.response.data.message || error.response.statusText}`
        );
      } else {
        throw new Error(
          "Failed to delete team schedule stats: Network or server error"
        );
      }
    });
}
