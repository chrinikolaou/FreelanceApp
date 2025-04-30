import { Freelancer } from "./Freelancer";
import { Job } from "./Job";

export interface Quote {
  id: number;
  freelancerId: number;
  freelancer: Freelancer;
  freelancerUsername: string;
  jobTitle: string;
  price: number;
  comment?: string;
  jobId: number;
  job: Job;
  evaluationScore?: number;
  decision?: string;
  quoteState: number;
  username: string;

}


export function getQuoteState(quoteState: number): string {
    switch (quoteState) {
      case 0: return "Rejected";
      case 1: return "Pending";
      case 2: return "Approved";
      case 3: return "Canceled";
      default: return "Unknown";
    }
  }
