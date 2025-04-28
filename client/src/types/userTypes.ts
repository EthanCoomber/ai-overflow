/**
 * This file contains the user-related type definitions used in the application.
 */

/**
 * Interface representing a user in the system.
 */
interface IUser {
  id: string;
  username: string;
  email: string;
}

export type { IUser };
