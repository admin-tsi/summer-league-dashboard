import { User } from "@/lib/types/login/user";
import axios from "axios";
import { z } from "zod";
import { UserSchema } from "@/lib/schemas/users/users";

type UserFormData = z.infer<typeof UserSchema>;

export async function getAllUsers(token: string | undefined): Promise<User[]> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

  try {
    const response = await axios.get<User[]>(`${baseUrl}/users`, {
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
          "An error occurred while fetching users",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function getUserById(
  userId: string,
  token: string | undefined,
): Promise<User> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

  try {
    const response = await axios.get<User>(`${baseUrl}/users/${userId}`, {
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
          "An error occurred while fetching user by ID",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function updateUser(
  userId: string,
  user: UserFormData,
  token: string | undefined,
): Promise<User> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

  try {
    const response = await axios.patch<User>(
      `${baseUrl}/users/${userId}`,
      user,
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
        error.response?.data.message || "An error occurred while updating user",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function validateAccount(
  userId: string,
  token: string | undefined,
): Promise<void> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

  try {
    await axios.post(
      `${baseUrl}/users/validate-account`,
      { userId: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message ||
          "An error occurred while validating user",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function deleteUser(
  userId: string,
  token: string | undefined,
): Promise<void> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

  try {
    await axios.delete(`${baseUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message || "An error occurred while deleting user",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function promoteUser(
  userId: string,
  token: string | undefined,
  role: string,
): Promise<void> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

  try {
    await axios.patch(
      `${baseUrl}/users/${userId}/promote-user`,
      {
        role: role,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data.message ||
          "An error occurred while promoting user",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}

export async function getAllKobeBryant(
  token: string | undefined,
): Promise<User[]> {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "";

  try {
    const response = await axios.get<User[]>(
      `${baseUrl}/users/kobe-bryant/saison`,
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
          "An error occurred while fetching Kobe Bryants",
      );
    } else {
      throw new Error("A non-Axios error occurred");
    }
  }
}
