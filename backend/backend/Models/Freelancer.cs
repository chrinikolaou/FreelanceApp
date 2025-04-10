using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Freelancer : User 
    {
        public int FreelancerId { get; set; }

        [StringLength(2000)]
        public string? Biography { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; }
        public enum Role
        {
            UI_DESIGNER ,
            UNITY_DEVELOPER,
            WEB_DEVELOPER,
            DISCORD_BOT_DEVELOPER,
            GRAPHICS_DESIGNER,
            SOFTWARE_DEVELOPER,
            MOBILE_DEVELOPER,
            UNREALENGINE_DEVELOPER,
            VFX_DESIGNER,
            ANIMATOR,
            VIDEO_EDITOR,
            CONTENT_WRITER

        }

    }
}
