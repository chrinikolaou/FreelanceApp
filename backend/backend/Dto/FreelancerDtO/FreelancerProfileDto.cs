namespace backend.Dto.FreelancerDtO
{
    public class FreelancerProfileDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string? Address { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsAdmin { get; set; }
        public string? Biography { get; set; }
        public decimal Balance { get; set; }
        public string Role { get; set; }
        public int CompletedJobs {  get; set; }
    }
}
