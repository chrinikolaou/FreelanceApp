namespace backend.Dto.CompletedJob
{
    public class CompletedJobResponseDto
    {
        public int Id { get; set; }
        public string JobTitle { get; set; }
        public string FreelancerUsername { get; set; }
        public decimal QuotePrice { get; set; }
        public DateTime CompletedAt { get; set; }
    }
}
