namespace backend.Dto.QuoteDto
{
    public class QuoteResponseDto
    {

        public int Id { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public int FreelancerId { get; set; }
        public string FreelancerUsername { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Comment { get; set; } = string.Empty;

    }
}
