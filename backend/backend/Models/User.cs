using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        
        public int Id {  get; set; }

        [Required]
        [MaxLength(30)]
        public string FirstName { get; set; }
        
        
        [Required]
        [MaxLength(30)]
        public string LastName { get; set; }
        
        
        [Required]
        [MaxLength(30)]
        public string UserName { get; set; }
       
        
        [Required]
        [MaxLength(50)]
        public string Email { get; set; }
        
        
        [Required]
        [MaxLength(512)]
        public string Password { get; set; }
        
    
        [MaxLength(255)]
        public string? Address { get; set; }


        [MaxLength(255)]
        public string? ImageUrl {  get; set; }

        public bool IsAdmin { get; set; } = false;







    }
}
