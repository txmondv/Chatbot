export interface RegisterRequest { 
    username: string; 
    password: string;
}

export interface RegisterResponse { 
    success: boolean;
    message: string;
}

export interface LoginRequest { 
    username: string; 
    password: string;
}

export interface LoginResponse {
    success: boolean;
    token?: string;
    error?: string;
}