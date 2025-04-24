namespace backend.Dto.AdminDto
{
    public class ViewQuoteDto
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public string Comment { get; set; }
        public string FreelancerName { get; set; }
        public string JobTitle { get; set; }
    }
}
