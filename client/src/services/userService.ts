/**
 * This module defines the functions to interact with the REST APIs for the user service.
 */

import { REACT_APP_API_URL, api } from "./config";
import { IUser } from "../types/userTypes";
// The base URL for the user API
const USER_API_URL = `${REACT_APP_API_URL}/user`;

/**
 * The function calls the API to login a user,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param email the email of the user.
 * @param password the password of the user.
 * @returns the response data from the API, which contains the token.
 */
const login = async (email: string, password: string): Promise<{ token: string, user: IUser }> => {
  try {
    const res = await api.post(`${USER_API_URL}/login`, { email, password }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (res.status !== 200) {
      throw new Error("Invalid credentials or server error");
    }
    return res.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

/**
 * The function calls the API to signup a new user,
 * returns the response data if the status is 200, otherwise throws an error.
 * @param username the username of the new user.
 * @param email the email of the new user.
 * @param password the password of the new user.
 * @returns the response data from the API, which contains the user object and token.
 */
const signup = async (
  username: string,
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  try {
    const res = await api.post(`${USER_API_URL}/signup`, { username, email, password }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (res.status !== 200) {
      throw new Error("Error during signup");
    }
    return res.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

export { login, signup };
