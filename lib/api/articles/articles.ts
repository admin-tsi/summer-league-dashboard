import axios from "axios";

export async function getAllArticles(token: string | undefined): Promise<any> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

  try {
    const response = await axios.get<any>(`${baseUrl}/blog`, {
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
          "An error occurred while fetching articles",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function getArticleById(
  id: string,
  token: string | undefined,
): Promise<any> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

  try {
    const response = await axios.get<any>(`${baseUrl}/blog/${id}`, {
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
          "An error occurred while fetching article",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}
