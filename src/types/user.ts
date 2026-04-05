export interface UserRequest {
    email: string;
}

export interface SignupResponse {
    email: string;
    id: number;
    created_at: string;
}

export interface LoginResponse {
    message: string;
}

export interface VerifyAccountRequest {
    email: string;
    code: string;
}

export interface VerifyAccountResponse {
    access_token: string;
    token_type: "bearer";
}
