using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Rating
    {
        public int Id { get; set; }

        // Freelancer being rated
        [Required]
        public int FreelancerId { get; set; }

        [ForeignKey("FreelancerId")]
        public Freelancer Freelancer { get; set; }

        [Required]
        public int CompletedJobId { get; set; }

        [ForeignKey("CompletedJobId")]
        public CompletedJob CompletedJob { get; set; } 

        // The user (job owner) who submitted the rating
        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required]
        [Range(1.0, 5.0, ErrorMessage = "Rating must be between 1 and 5.")]
        public double Rate { get; set; }

        [MaxLength(1000)]
        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
