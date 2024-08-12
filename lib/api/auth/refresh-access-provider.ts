import jwt, { JwtPayload } from "jsonwebtoken";
import { fetchNewAccessToken } from "./refresh-access";

interface DecodedToken extends JwtPayload {
  exp?: number;
}

export const verifyTokenExpiration = async (
  accessToken: string,
  refreshToken: string,
): Promise<string | null> => {
  const checkTokenExpiration = (token: string): boolean => {
    try {
      const decoded = jwt.decode(token) as DecodedToken;

      if (!decoded || !decoded.exp) {
        throw new Error("Token decoding failed or expiration not found");
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  if (!checkTokenExpiration(accessToken)) {
    return accessToken;
  }

  if (refreshToken) {
    try {
      return await fetchNewAccessToken(refreshToken);
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      return null;
    }
  }

  return null;
};
