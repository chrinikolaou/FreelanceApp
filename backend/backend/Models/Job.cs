using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using backend.Enum;

namespace backend.Models
{
    public class Job
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        [MaxLength(50)]
        public Role Category { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Budget { get; set; }

        [Required]
        public JobState State { get; set; } = JobState.Open;

        public DateTime Deadline { get; set; }

        public int? AcceptedQuoteId { get; set; }

        [ForeignKey("AcceptedQuoteId")]
        public Quote? AcceptedQuote { get; set; }


    }
}
