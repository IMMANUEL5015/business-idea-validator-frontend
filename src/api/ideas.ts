import axios from "axios";
import type { IdeasListResponse, IdeaDetail, AddIdeaRequest } from "../types/idea";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const fetchIdeas = async (page: number, limit: number): Promise<IdeasListResponse> => {
    const response = await axios.get<IdeasListResponse>(`${BASE_URL}/ideas`, {
        params: { page, limit },
        headers: authHeaders(),
    });
    return response.data;
};

export const addIdea = async (payload: AddIdeaRequest): Promise<IdeaDetail> => {
    const response = await axios.post<IdeaDetail>(`${BASE_URL}/ideas/`, payload, {
        headers: authHeaders(),
    });
    return response.data;
};

export const fetchIdeaById = async (id: number): Promise<IdeaDetail> => {
    const response = await axios.get<IdeaDetail>(`${BASE_URL}/ideas/${id}`, {
        headers: authHeaders(),
    });
    return response.data;
};

export const updateIdea = async (id: number, payload: AddIdeaRequest): Promise<IdeaDetail> => {
    const response = await axios.put<IdeaDetail>(`${BASE_URL}/ideas/${id}`, payload, {
        headers: authHeaders(),
    });
    return response.data;
};

export const deleteIdea = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/ideas/${id}`, {
        headers: authHeaders(),
    });
};

export const retryValidation = async (id: number): Promise<IdeaDetail> => {
    const response = await axios.post<IdeaDetail>(`${BASE_URL}/ideas/${id}/retry-validation`, {}, {
        headers: authHeaders(),
    });
    return response.data;
};

export const retryBusinessPlan = async (id: number): Promise<IdeaDetail> => {
    const response = await axios.post<IdeaDetail>(`${BASE_URL}/ideas/${id}/retry-business-plan`, {}, {
        headers: authHeaders(),
    });
    return response.data;
};