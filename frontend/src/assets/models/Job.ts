import { User } from "./User";

export interface Job {
    id: number;
    title: string;
    description: string;
    category: number;
    createdAt: string;
    username: string;
    user: User;
    budget: number;
    deadline: string;
    state: string;
    acceptedQuoteId: number | null;
    freelancerUsername: string | null;
}