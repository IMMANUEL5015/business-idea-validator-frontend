export interface ApiErrorDetail {
    loc: [string, number];
    msg: string;
    type: string;
    input: string;
    ctx: Record<string, unknown>;
}

export interface ApiErrorResponse {
    detail: ApiErrorDetail[] | string;
}