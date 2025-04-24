namespace backend.Dto.RatingDto
{
    public class CreateRatingDto
    {
        public int CompletedJobId { get; set; }
        public int Rate { get; set; }
        public string Comment { get; set; }
    }
}
