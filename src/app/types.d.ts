export interface Language {
    name: string;
    language: string;
}

export interface JokeResponse {
    error: boolean;
    amount: number;
    jokes?: Array<{
        category: string;
        type: string;
        joke?: string;
        setup?: string;
        delivery?: string;
    }>;
    setup?: string;
    delivery?: string;
    joke?: string;
    type?: string;
}