import { User } from "@prisma/client";
import { findUserByToken } from "../services/auth.service";

const isAuthenticated = async (
  accessToken: string
): Promise<{
  isAuthenticated: boolean;
  user: Omit<User, "password"> | undefined;
}> => {
  try {
    if (!accessToken) {
      return { isAuthenticated: false, user: undefined };
    }
    const user = await findUserByToken(accessToken);
    if (!user) return { isAuthenticated: false, user: undefined };
    return { isAuthenticated: true, user: user };
  } catch (error) {
    console.log(`Error:  ${error}`);
    return { isAuthenticated: false, user: undefined };
  }
};

export { isAuthenticated };
