using backend.Enum;

namespace backend.Models
{
    public class CompletedJob
    {
        public int Id { get; set; }

        // Clone του Job
        public int JobId { get; set; }
        public string JobTitle { get; set; }
        public string JobDescription { get; set; }
        public decimal Budget { get; set; }
        public DateTime JobPostedDate { get; set; }
        public Role JobCategory { get; set; }

        // Clone του Quote
        public int QuoteId { get; set; }
        public decimal QuotePrice { get; set; }
        public string QuoteMessage { get; set; }

        // Clone του User
        public int UserId { get; set; } // για reference, αν χρειαστεί
        public string UserUsername { get; set; }
        public string UserEmail { get; set; }

        // Clone του Freelancer
        public int FreelancerId { get; set; } // για reference, αν χρειαστεί
        public int FreelancerUserId { get; set; }
        public string FreelancerUsername { get; set; }
        public string FreelancerUserEmail { get; set; }

        public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    }
}
