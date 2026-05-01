export interface UserInfo {
    username: string;
    email: string;
    role: string;
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
