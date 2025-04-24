namespace backend.Dto.UserDto
{
    public class UserProfileDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string? Address { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsAdmin { get; set; }
    }
}
