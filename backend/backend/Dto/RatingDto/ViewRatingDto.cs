namespace backend.Dto.RatingDto
{
    public class ViewRatingDto
    {
        public int Id { get; set; }
        public double Rate { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }

        public int JobId { get; set; }
        public string JobTitle { get; set; }

        public int UserId { get; set; }
        public string Username { get; set; }
        public string FreelancerUsername { get; set; }
    }
}
