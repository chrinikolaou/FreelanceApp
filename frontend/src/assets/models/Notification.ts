import { Quote } from "./Quote";

export interface Notification {

    id: number;
    userId: number;
    message: string;
    isRead: boolean;
    createdAt: string;
    quote: Quote;
    freelancerUsername: string | null;

}