import axios from "axios";
import type { 
    UserRequest, SignupResponse, LoginResponse,
    VerifyAccountRequest, VerifyAccountResponse 
} from "../types/user";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const signupUser = async (payload: UserRequest): Promise<SignupResponse> => {
    const response = await axios.post<SignupResponse>(`${BASE_URL}/users/`, payload);
    return response.data;
};

export const loginUser = async (payload: UserRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${BASE_URL}/users/login`, payload);
    return response.data;
};

export const verifyUser = async (payload: VerifyAccountRequest): Promise<VerifyAccountResponse> => {
    const response = await axios.post<VerifyAccountResponse>(`${BASE_URL}/users/verify`, payload);
    return response.data;
};