namespace backend.Dto.QuoteDto
{
    public class EvaluateQuoteDto
    {
        public int FreelancerId { get; set; }
        public int JobId { get; set; }
        public decimal QuotePrice { get; set; }
    }
}
