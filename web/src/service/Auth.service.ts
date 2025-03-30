import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/Auth.types";
import { FetchWrapper } from "./FetchWrapper";

export const isAuthenticated = async (): Promise<boolean> => FetchWrapper.get<boolean>("/api/auth/isAuthenticated");

export const login = async (request: LoginRequest): Promise<LoginResponse> => 
    FetchWrapper.post<LoginResponse>("/api/auth/login", request);

export const register = async (request: RegisterRequest): Promise<RegisterResponse> => 
    FetchWrapper.post<RegisterResponse>("/api/auth/register", request);