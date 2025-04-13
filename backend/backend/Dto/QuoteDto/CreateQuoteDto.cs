namespace backend.Dto.QuoteDto
{
    public class CreateQuoteDto
    {
        public int JobId { get; set; }
        public decimal Price { get; set; }
        public string Comment { get; set; }
    }
}
