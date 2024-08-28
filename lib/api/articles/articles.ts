import axios from "axios";

const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function getAllArticles(token: string | undefined): Promise<any> {
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

export async function updateArticleById(
  id: string,
  data: any,
  token: string | undefined,
): Promise<any> {
  try {
    const response = await axios.patch<any>(`${baseUrl}/blog/${id}`, data, {
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
          "An error occurred while updating article",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function updateArticleStatus(
  id: string,
  status: string,
  featuredArticle: boolean,
  token: string | undefined,
): Promise<any> {
  try {
    const response = await axios.patch<any>(
      `${baseUrl}/blog/${id}/status`,
      { status, featuredArticle },
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
          "An error occurred while updating article status",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function updateCurrentUserArticleStatus(
  id: string,
  data: any,
  token: string | undefined,
): Promise<any> {
  try {
    const response = await axios.patch<any>(
      `${baseUrl}/blog/${id}/my-article-status`,
      data,
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
          "An error occurred while updating article",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function createArticle(
  data: any,
  token: string | undefined,
  competitionId: string | null,
): Promise<any> {
  try {
    const response = await axios.post<any>(`${baseUrl}/blog`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-competition-id": competitionId,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message ||
          "An error occurred while creating article",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function getCurrentUserArticles(
  token: string | undefined,
  userId: string,
): Promise<any> {
  try {
    const response = await axios.get<any>(
      `${baseUrl}/blog/author/${userId}/articles`,
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
          "An error occurred while fetching articles",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function deleteArticle(
  token: string | undefined,
  id: string,
): Promise<any> {
  try {
    const response = await axios.delete<any>(`${baseUrl}/blog/${id}`, {
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
          "An error occurred while deleting article",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}
