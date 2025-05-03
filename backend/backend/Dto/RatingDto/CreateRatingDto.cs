namespace backend.Dto.RatingDto
{
    public class CreateRatingDto
    {
        public int CompletedJobId { get; set; }
        public double Rate { get; set; }
        public string Comment { get; set; }
    }
}
