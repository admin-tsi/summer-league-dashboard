import axios from "axios";

const api = process.env.NEXT_PUBLIC_BASE_URL;

if (!api) {
  throw new Error(
    "La variable d'environnement NEXT_PUBLIC_BASE_URL n'est pas définie."
  );
}

export const submitForm = async (data: any) => {
  try {
    const response = await axios.post(`${api}/auth/register`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Une erreur est survenue."
      );
    } else {
      throw new Error("Une erreur est survenue.");
    }
  }
};
