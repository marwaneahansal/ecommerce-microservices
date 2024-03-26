import { findUserByToken } from "../services/auth.service";

const isAuthenticated = async (accessToken: string): Promise<boolean> => {
  try {
    if (!accessToken) {
      return false;
    }
    const user = await findUserByToken(accessToken);
    if (!user) return false;
    return true;
  } catch (error) {
    console.log(`Error:  ${error}`);
    return false;
  }
};

export { isAuthenticated }
