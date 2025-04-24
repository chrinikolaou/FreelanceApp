using backend.Enum;
using System.ComponentModel.DataAnnotations;

namespace backend.Dto
{
    public class FreelancerRegisterDto
    {
        [StringLength(2000)]
        public string Biography { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Balance must be a positive number.")]
        public decimal Balance { get; set; }

        [Required]
        public Role Role { get; set; }
    }
}