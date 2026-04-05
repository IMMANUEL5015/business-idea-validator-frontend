import { create } from "zustand";
import { fetchIdeas } from "../api/ideas";
import type { Idea } from "../types/idea";

interface IdeasState {
    ideas: Idea[];
    total: number;
    pages: number;
    isLoading: boolean;
    errorMsg: string;
    loadIdeas: (page: number, limit: number) => Promise<void>;
}

const useIdeasStore = create<IdeasState>((set) => ({
    ideas: [],
    total: 0,
    pages: 1,
    isLoading: false,
    errorMsg: "",

    loadIdeas: async (page, limit) => {
        set({ isLoading: true, errorMsg: "" });
        try {
            const data = await fetchIdeas(page, limit);
            set({
                ideas: data.ideas,
                total: data.total,
                pages: data.pages,
                isLoading: false,
            });
        } catch {
            set({ isLoading: false, errorMsg: "Failed to load ideas. Please try again." });
        }
    },
}));

export default useIdeasStore;