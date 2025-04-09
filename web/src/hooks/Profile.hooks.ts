import { useQuery } from "react-query";
import { getAllUsers, getUsername, getUserRoles } from "../service/User.service";
import { User, UserRole } from "../types/User.types";

export const useGetUsername = () => {
    return useQuery<string>({
        queryKey: "getUserName",
        queryFn: getUsername,
        initialData: "Loading..."
    });
};

export const useGetUserRoles = () => {
    return useQuery<UserRole[]>({
        queryKey: "userRoles",
        queryFn: getUserRoles
    });
};

export const useGetAllUsers = (enabled = true) => {
    return useQuery<User[]>({
        queryKey: "allUsers",
        queryFn: getAllUsers,
        enabled: enabled
    });
};