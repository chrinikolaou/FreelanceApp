using backend.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Freelancer
    {
        [Key]
        public int FreelancerId { get; set; } 

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [StringLength(2000)]
        public string? Biography { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; }
        [Required]
        public Role Role { get; set; }


        public int CompletedJobs { get; set; } = 0;


    }

    
}
