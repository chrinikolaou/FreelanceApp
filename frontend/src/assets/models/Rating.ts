import { Freelancer } from "./Freelancer";

export interface Rating {
  id: number;
  freelancerId: number;
  freelancer: Freelancer;
  completedJobId: number;
  userId: number;
  rate: number; // 1 to 5
  comment?: string;
  createdAt: string; 
}