export type UserRole = "SUPPORT" | "TECHNICAL" | "MANAGER";

export interface User {
    id: number;
    username: string;
    roles: UserRole[];
}

export interface ChangeRoleRequest {
    username: string;
    role: UserRole;
}