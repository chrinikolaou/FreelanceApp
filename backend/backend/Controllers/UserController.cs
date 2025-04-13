using backend.Data;
using backend.Dto.UserDto;
using backend.Dto.FreelancerDtO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using backend.Dto;
using backend.Models;
using backend.Enum;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/user")]
    public class UserController : Controller
    {
        private readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }


        [HttpGet("view-profile")]
        [Authorize]
        public IActionResult ViewMyProfile()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found.");

         
            var freelancer = _context.Freelancers
                .Include(f => f.User)
                .FirstOrDefault(f => f.UserId == userId);

            if (freelancer != null)
            {
                
                var freelancerProfile = new FreelancerProfileDto
                {
                    FirstName = freelancer.User.FirstName,
                    LastName = freelancer.User.LastName,
                    UserName = freelancer.User.UserName,
                    Email = freelancer.User.Email,
                    Address = freelancer.User.Address,
                    ImageUrl = freelancer.User.ImageUrl,
                    Biography = freelancer.Biography,
                    Balance = freelancer.Balance,
                    Role = freelancer.Role.ToString()
                };

                return Ok(freelancerProfile);
            }
            else
            {
                var userProfile = new UserProfileDto
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    Address = user.Address,
                    ImageUrl = user.ImageUrl
                };

                return Ok(userProfile);
            }
        }



        [HttpPost("register-as-freelancer")]
        [Authorize]
        public IActionResult BecomeFreelancer([FromBody] FreelancerRegisterDto freelancerDto)
        {
            if (freelancerDto == null)
            {
                return BadRequest("Invalid data.");
            }

            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            // Check if already freelancer
            if (_context.Freelancers.Any(f => f.UserId == userId))
            {
                return BadRequest("You are already registered as a freelancer.");
            }

            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return NotFound("User not found.");


            var freelancer = new Freelancer
            {
                UserId = userId,
                Biography = freelancerDto.Biography,
                Balance = freelancerDto.Balance,
                Role = freelancerDto.Role
            };


            _context.Freelancers.Add(freelancer);
            _context.SaveChanges();

            return Ok(new { message = "You are now registered as a freelancer." });
        }


        [HttpDelete("unregister-from-freelancer")]
        [Authorize]
        public IActionResult UnregisterFromFreelancer()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var freelancer = _context.Freelancers.FirstOrDefault(f => f.UserId == userId);
            if (freelancer == null)
            {
                
                return BadRequest("You are not registered as a freelancer.");
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

            return Ok(new { message = "You are no longer a freelancer." });
        }


    }
}
