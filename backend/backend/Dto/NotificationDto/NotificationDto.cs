using backend.Models;

namespace backend.Dto.NotificationDto
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public Quote? Quote { get; set; }
        public string? FreelancerUsername { get; set; } = string.Empty;
    }
}
