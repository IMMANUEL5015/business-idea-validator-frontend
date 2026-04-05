export type IdeaStatus = "draft" | "validated" | "completed";

export interface Idea {
    id: number;
    title: string;
    description: string;
    user_id: number;
    status: IdeaStatus;
}

export interface IdeasListResponse {
    ideas: Idea[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface IdeaValidation {
    id: number;
    idea_id: number;
    score: number;
    risks: string;
    opportunities: string;
    ai_feedback: string;
}

export interface BusinessPlanContent {
    executive_summary: string;
    problem_statement: string;
    proposed_solution: string;
    target_market: string;
    unique_value_proposition: string;
    revenue_model: string;
    go_to_market_strategy: string;
    competitive_landscape: string;
    risks_and_mitigation: string;
    financial_outlook: string;
    next_steps: string;
}

export interface BusinessPlan {
    id: number;
    idea_id: number;
    content: BusinessPlanContent;
}

export interface IdeaDetail extends Idea {
    validation: IdeaValidation | null;
    business_plan: BusinessPlan | null;
}

export interface AddIdeaRequest {
    title: string;
    description: string;
}