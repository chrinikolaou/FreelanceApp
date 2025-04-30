import { Freelancer, User } from "./Freelancer";

export type Profile = User | (Freelancer & { user: User });
