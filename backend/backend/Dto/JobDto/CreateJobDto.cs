using backend.Enum;

namespace backend.Dto.JobDto
{
    public class CreateJobDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Role Category { get; set; } = 0;
        public decimal Budget { get; set; }
        public DateTime Deadline { get; set; }
    }
}
