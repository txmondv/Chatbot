import { ChangeRoleRequest, User } from "../types/User.types";
import { FetchWrapper } from "../utils/FetchWrapper";

export const getAllUsers = async (): Promise<User[]> => FetchWrapper.get<User[]>("/api/users/info/getUsers");
export const getUsername = async (): Promise<string> => FetchWrapper.get<string>("/api/users/info/getUsername");

export const getUserRoles = async (): Promise<string[]> => FetchWrapper.get<string[]>("/api/users/roles");
export const addUserRole = async (request: ChangeRoleRequest): Promise<void> => FetchWrapper.post<void>("/api/users/roles/add", request);
export const removeUserRole = async (request: ChangeRoleRequest): Promise<void> => FetchWrapper.post<void>("/api/users/roles/remove", request);