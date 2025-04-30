import { User } from "./User";
import { Role } from "./Role";

export interface Freelancer extends User{
  freelancerId: number;
  userId: number;
  user: User;
  biography?: string;
  balance: number;
  role: Role;
  completedJobs: number;
}
