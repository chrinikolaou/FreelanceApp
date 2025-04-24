export interface Job {
    id: number;
    title: string;
    description: string;
    category: number;
    createdAt: string;
    username: string;
    budget: number;
    deadline: string;
    state: string;
    acceptedQuoteId: number | null;
}