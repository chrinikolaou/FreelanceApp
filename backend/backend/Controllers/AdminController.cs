using backend.Data;
using backend.Dto.AdminDto;
using backend.Dto.AuthDto;
using backend.Dto.NotificationDto;
using backend.Enum;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/admin")]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;
        private readonly IPasswordHasher<User> _passwordHasher;
        public AdminController(DataContext context, IConfiguration config, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _config = config;
            _passwordHasher = passwordHasher;
        }

        [HttpGet("view/freelancers/")]
        [Authorize]
        public IActionResult ViewAllFreelancers()
        {
            var isAdminClaim = User.Claims.FirstOrDefault(c => c.Type == "isAdmin")?.Value;
            if (isAdminClaim == null || !bool.Parse(isAdminClaim))
                return Unauthorized("You are not an Admin.");


            var freelancers = _context.Freelancers
                 .Include(f => f.User)
                 .Select(u => new ViewFreelancerDto
                 {
                     FreelancerId = u.FreelancerId,
                     Username = u.User.UserName,
                     Email = u.User.Email
                 })
                 .ToList();


            if (freelancers == null || !freelancers.Any())
            {
                return NotFound("No users found.");
            }

            return Ok(freelancers);
        }


        [HttpDelete("delete/freelancer/{id}")]
        [Authorize]
        public IActionResult DeleteFreelancer(string username)
        {
            var isAdminClaim = User.Claims.FirstOrDefault(c => c.Type == "isAdmin")?.Value;
            if (isAdminClaim == null || !bool.Parse(isAdminClaim))
                return Unauthorized("You are not an Admin.");


            var freelancer = _context.Freelancers
                .Include(f => f.User)
                .FirstOrDefault(f => f.User.UserName == username);
            if (freelancer == null)
            {

                return BadRequest("Freelancer not found.");
            }

            var quotesToDelete = _context.Quotes
                .Include(q => q.Job)
                .Where(q => q.FreelancerId == freelancer.FreelancerId)
                .ToList();


            if (quotesToDelete.Any())
            {
                foreach (var quote in quotesToDelete)
                {

                    if (quote.Job != null && quote.Job.AcceptedQuoteId == quote.Id) //Quote is accepted by this job, then delete
                    {

                        quote.Job.AcceptedQuoteId = null;
                        quote.Job.State = JobState.Open;


                    }
                }
            }

            _context.Quotes.RemoveRange(quotesToDelete);
            _context.Freelancers.Remove(freelancer);
            _context.SaveChanges();

            return Ok(new { message = "You successfully deleted the freelancer" });
        }



        [HttpGet("view/users/")]
        [Authorize]
        public IActionResult ViewAllUsers()
        {
            var isAdminClaim = User.Claims.FirstOrDefault(c => c.Type == "isAdmin")?.Value;
            if (isAdminClaim == null || !bool.Parse(isAdminClaim))
                return Unauthorized("You are not an Admin.");


            var users = _context.Users
                 .Select(u => new ViewUserDto
                 {
                     UserId = u.Id,
                     Username = u.UserName,
                     Email = u.Email
                 })
                 .ToList();


            if (users == null || !users.Any())
            {
                return NotFound("No users found.");
            }

            return Ok(users);
        }


        [HttpDelete("delete/user/{username}")]
        [Authorize]
        public IActionResult DeleteUserById(string username)
        {
            var isAdminClaim = User.Claims.FirstOrDefault(c => c.Type == "isAdmin")?.Value;
            if (isAdminClaim == null || !bool.Parse(isAdminClaim))
                return BadRequest("You are not an Admin.");

            var user = _context.Users.FirstOrDefault(u => u.UserName == username);
            if (user == null)
            {
                return BadRequest("User not found.");
            }
            int id = user.Id;

            // 1. Διαγραφή jobs του χρήστη
            var jobs = _context.Jobs
            .Include(j => j.AcceptedQuote)
            .Where(j => j.UserId == id)
            .ToList();

            foreach (var job in jobs)
            {
                // Αν είχε αποδεχτεί κάποιο quote, άδειασε το
                if (job.AcceptedQuoteId != null)
                {
                    job.State = JobState.Open;
                    job.AcceptedQuoteId = null;
                    job.AcceptedQuote = null;
                    _context.Jobs.Update(job);
                    _context.SaveChanges();
                }

                // Quotes που έχουν γίνει στη συγκεκριμένη δουλειά
                var relatedQuotes = _context.Quotes
                    .Where(q => q.JobId == job.Id)
                    .Include(q => q.Freelancer)
                    .ThenInclude(f => f.User)
                    .ToList();

                foreach (var quote in relatedQuotes)
                {
                    var notification = new Notification
                    {
                        UserId = quote.Freelancer.UserId,
                        Message = $"Το quote σας με Id '{quote.Id}' για τη δουλειά '{job.Title}' έχει αφαιρεθεί, καθώς η δουλειά διαγράφηκε.",
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Notifications.Add(notification);
                }

                _context.Quotes.RemoveRange(relatedQuotes);
            }

            _context.Jobs.RemoveRange(jobs);


            var freelancer = _context.Freelancers.FirstOrDefault(f => f.UserId == id);
            if (freelancer != null)
            {
                var freelancerQuotes = _context.Quotes
                    .Include(q => q.Job)
                    .Where(q => q.FreelancerId == freelancer.FreelancerId)
                    .ToList();

                foreach (var quote in freelancerQuotes)
                {
                    if (quote.Job != null && quote.Job.AcceptedQuoteId == quote.Id)
                    {
                        quote.Job.AcceptedQuoteId = null;
                        quote.Job.State = JobState.Open;
                        _context.Jobs.Update(quote.Job);
                        _context.SaveChanges();

                        var notification = new Notification
                        {
                            UserId = quote.Job.UserId,
                            Message = $"Η αποδεκτή προσφορά για τη δουλειά '{quote.Job.Title}' μόλις διαγράφηκε επειδή ο freelancer διαγράφηκε.",
                            CreatedAt = DateTime.UtcNow
                        };
                        _context.Notifications.Add(notification);
                    }
                }

                _context.Quotes.RemoveRange(freelancerQuotes);
                _context.Freelancers.Remove(freelancer);
            }

            var notifications = _context.Notifications.Where(n => n.UserId == id).ToList();
            _context.Notifications.RemoveRange(notifications);


            _context.Users.Remove(user);
            _context.SaveChanges();

            return Ok(new { message = "User and related data deleted successfully." });
        }


        [HttpGet("view/quotes/")]
        [Authorize]
        public IActionResult ViewAllQuotes()
        {
            var isAdminClaim = User.Claims.FirstOrDefault(c => c.Type == "isAdmin")?.Value;
            if (isAdminClaim == null || !bool.Parse(isAdminClaim))
                return Unauthorized("You are not an Admin.");


            var quotes = _context.Quotes
                .Include(q => q.Freelancer)
                    .ThenInclude(f => f.User)
                .Include(q => q.Job)
                .Select(q => new ViewQuoteDto
                {
                    Id = q.Id,
                    Price = q.Price,
                    Comment = q.Comment,
                    FreelancerName = q.Freelancer.User.UserName,
                    JobTitle = q.Job.Title
                }).ToList();


            if (quotes == null || !quotes.Any())
            {
                return NotFound("No quotes have been found.");
            }

            return Ok(quotes);
        }



        [HttpDelete("delete/quote/{id}")]
        [Authorize]
        public IActionResult DeleteQuoteById(int id)
        {
            var isAdminClaim = User.Claims.FirstOrDefault(c => c.Type == "isAdmin")?.Value;
            if (isAdminClaim == null || !bool.Parse(isAdminClaim))
                return Unauthorized("You are not an Admin.");

            var quote = _context.Quotes
             .Include(q => q.Job)
             .ThenInclude(job => job.User)
             .FirstOrDefault(q => q.Id == id);

            if (quote == null)
                return NotFound();


            if (quote.Job != null && quote.Job.AcceptedQuoteId == quote.Id)
            {

                var message = $"Η αποδεκτή προσφορά για τη δουλειά '{quote.Job.Title}' μόλις διαγράφηκε από τους διαχειριστές";

                var notification = new Notification
                {
                    UserId = quote.Job.UserId,
                    Message = message,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Notifications.Add(notification);

                quote.Job.AcceptedQuoteId = null;
                quote.Job.State = JobState.Open;
                _context.Jobs.Update(quote.Job);
                _context.SaveChanges();
            }



            _context.Quotes.Remove(quote);
            _context.SaveChanges();

            return Ok(new { message = "Quote deleted successfully." });
        }


        [HttpGet("view/jobs/")]
        [Authorize]
        public IActionResult ViewAllJobs()
        {
            var isAdminClaim = User.Claims.FirstOrDefault(c => c.Type == "isAdmin")?.Value;
            if (isAdminClaim == null || !bool.Parse(isAdminClaim))
                return Unauthorized("You are not an Admin.");


            var jobs = _context.Jobs
                 .Include(j => j.User)
                 .Select(j => new ViewJobDto
                 {
                     Id = j.Id,
                     Title = j.Title,
                     Description = j.Description,
                     Category = j.Category,
                     Budget = j.Budget,
                     Deadline = j.Deadline,
                     CreatedAt = j.CreatedAt,
                     UserEmail = j.User.Email,
                     UserName = j.User.UserName,
                     State = j.State.ToString(),
                     AcceptedQuoteId = j.AcceptedQuoteId
                 })
                .ToList();


            if (jobs == null || !jobs.Any())
            {
                return NotFound("No jobs have been found.");
            }

            return Ok(jobs);
        }


        [HttpDelete("delete/job/{id}")]
        [Authorize]
        public IActionResult DeleteJob(int id)
        {
            var isAdminClaim = User.Claims.FirstOrDefault(c => c.Type == "isAdmin")?.Value;
            if (isAdminClaim == null || !bool.Parse(isAdminClaim))
                return Unauthorized("You are not an Admin.");

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));


            var job = _context.Jobs
                .Include(j => j.User)
                .Include(j => j.AcceptedQuote)
                .FirstOrDefault(j => j.Id == id);

            if (job == null)
                return NotFound("Job not found");

            if (job.AcceptedQuoteId != null)
            {
                job.State = JobState.Open;
                job.AcceptedQuoteId = null;
                job.AcceptedQuote = null;
                _context.Jobs.Update(job);
                _context.SaveChanges();
            }

            var quotes = _context.Quotes
                .Include(q => q.Job)
                    .ThenInclude(j => j.User)
                .Include(q => q.Freelancer)
                    .ThenInclude(f => f.User)
                .Where(q => q.JobId == job.Id)
                .ToList();




            //Send notification

            foreach (var quote in quotes)
            {
                string message = $"Το quote σας με Id '{quote.Id}' για την δουλειά '{job.Title}' έχει αφαιρεθεί, καθώς η δουλειά διαγράφηκε.";

                var notification = new Notification
                {
                    UserId = quote.Freelancer.UserId,
                    Message = message,
                    CreatedAt = DateTime.UtcNow,
                };

                // Αποθήκευση της ειδοποίησης στη βάση δεδομένων
                _context.Notifications.Add(notification);
            }




            _context.Quotes.RemoveRange(quotes);

            _context.Jobs.Remove(job);


            _context.SaveChanges();

            return Ok(new { message = "Job deleted successfully" });
        }


        [HttpPost("send/notification/")]
        [Authorize]
        public IActionResult SendNotification([FromBody] CreateNotificationDto dto)
        {
            var isAdminClaim = User.Claims.FirstOrDefault(c => c.Type == "isAdmin")?.Value;
            if (isAdminClaim == null || !bool.Parse(isAdminClaim))
                return Unauthorized("You are not an Admin.");

            var user = _context.Users.FirstOrDefault(u => u.Id == dto.UserId);
            if (user == null)
                return NotFound("User not found");

            var notification = new Notification
            {
                UserId = dto.UserId,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            _context.SaveChanges();

            return Ok("Notification sent.");
        }

        // Register
        [HttpPost("create/user/")]
        public IActionResult CreateUser(RegisterRequestDto request)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.UserName == request.Username);
            if (existingUser != null)
            {
                return BadRequest("Username already taken");
            }

            var user = new User
            {
                UserName = request.Username,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Address = request.Address,
                ImageUrl = request.ImageUrl,
                IsAdmin = request.IsAdmin
            };

            // Hash the password before saving
            user.Password = _passwordHasher.HashPassword(user, request.Password);

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User created successfully");
        }

        // Update
        [HttpPut("update/user/{username}")]
        [Authorize]
        public IActionResult UpdateUser([FromBody] UpdateUserDto updatedto)
        {
            var isAdminClaim = User.Claims.FirstOrDefault(c => c.Type == "isAdmin")?.Value;
            if (isAdminClaim == null || !bool.Parse(isAdminClaim))
                return Unauthorized("You are not an Admin.");

            var user = _context.Users.FirstOrDefault(u => u.UserName == updatedto.PreviousUsername);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            var freelancer = _context.Freelancers
                .Include(f => f.User)
                .FirstOrDefault(f => f.User.UserName == updatedto.PreviousUsername);

            user.FirstName = updatedto.FirstName ?? user.FirstName;
            user.LastName = updatedto.LastName ?? user.LastName;
            user.Address = updatedto.Address ?? user.Address;
            user.ImageUrl = updatedto.ImageUrl ?? user.ImageUrl;
            user.Email = updatedto.Email ?? user.Email;

            _context.Users.Update(user);

            if (freelancer != null)
            {
                freelancer.Biography = updatedto.Biography ?? freelancer.Biography;
                freelancer.Role = updatedto.Role ?? freelancer.Role;
                _context.Freelancers.Update(freelancer);
            }



            // Ενημέρωση CompletedJobs
            var completedJobs = _context.CompletedJobs
                .Where(cj => cj.UserId == user.Id || cj.FreelancerUserId == user.Id)
                .ToList();

            foreach (var job in completedJobs)
            {
                if (job.UserId == user.Id)
                {
                    job.UserUsername = user.UserName;
                    job.UserEmail = user.Email;
                }

                if (job.FreelancerUserId == user.Id && freelancer != null)
                {
                    job.FreelancerUsername = user.UserName;
                    job.FreelancerUserEmail = user.Email;
                }

                _context.CompletedJobs.Update(job);
            }





            _context.SaveChanges();
            return Ok("User updated successfully.");
        }
    }
}