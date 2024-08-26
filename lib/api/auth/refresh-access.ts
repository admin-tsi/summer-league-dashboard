export const fetchNewAccessToken = async (
  refreshToken: string,
): Promise<string> => {
  try {
    const api = process.env.NEXT_PUBLIC_BASE_URL;

    const response = await fetch(`${api}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to refresh access token: ${errorText}`);
    }

    const { accessToken } = await response.json();

    return accessToken;
  } catch (error: any) {
    console.error("Error in fetchNewAccessToken:", error);
    throw new Error(
      `Error fetching new access token: ${(error as Error).message}`,
    );
  }
};
