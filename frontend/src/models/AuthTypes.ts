export interface UserInfo {
    userId: number;
    email: string;
    role: string;
    exp: number;
}

export interface LoginResponse {
    token: string;
    user: UserInfo;
    isNewUser?: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
}
