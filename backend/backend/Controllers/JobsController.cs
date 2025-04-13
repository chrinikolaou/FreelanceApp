using backend.Data;
using backend.Dto.JobDto;
using backend.Enum;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/jobs")]
    public class JobsController : ControllerBase
    {
        private readonly DataContext _context;

        public JobsController(DataContext context)
        {
            _context = context;
        }


        // POST: Create new Job
        [HttpPost("create-job")]
        [Authorize]
        public IActionResult CreateJob([FromBody] CreateJobDto request)
        {
            // Get the current user ID from JWT claims
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var job = new Job
            {
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                CreatedAt = DateTime.UtcNow,
                UserId = int.Parse(userId),
                Budget = request.Budget,
                Deadline = request.Deadline,
                State = JobState.Open,
                AcceptedQuoteId = null
            };

            _context.Jobs.Add(job);
            _context.SaveChanges();

            var user = _context.Users.Find(job.UserId);

            var response = new JobResponseDto
            {
                Id = job.Id,
                Title = job.Title,
                Description = job.Description,
                Category = job.Category,
                CreatedAt = job.CreatedAt,
                Username = user?.UserName,
                Budget = job.Budget,
                Deadline = job.Deadline,
                State = job.State.ToString(),
                AcceptedQuoteId = job.AcceptedQuoteId
            };

            return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, response);
        }

        // GET: Get all jobs
        [HttpGet("view-all-jobs")]
        public IActionResult GetAllJobs()
        {
            var jobs = _context.Jobs
            .Include(j => j.User)
            .Select(j => new JobResponseDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description,
                Category = j.Category,
                CreatedAt = j.CreatedAt,
                Username = j.User.UserName,
                Budget = j.Budget,
                Deadline = j.Deadline,
                State = j.State.ToString(),
                AcceptedQuoteId = j.AcceptedQuoteId
            })
            .ToList();

            return Ok(jobs);
        }

        // GET: Get job by ID
        [HttpGet("view-job/{id}")]
        public IActionResult GetJobById(int id)
        {
            var job = _context.Jobs
                .Include(j => j.User)
                .Where(j => j.Id == id)
                .Select(j => new JobResponseDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    Description = j.Description,
                    Category = j.Category,
                    CreatedAt = j.CreatedAt,
                    Username = j.User.UserName,
                    Budget = j.Budget,
                    Deadline = j.Deadline,
                    State = j.State.ToString(),
                    AcceptedQuoteId = j.AcceptedQuoteId
                })
                .FirstOrDefault();

            if (job == null)
            {
                return NotFound();
            }

            return Ok(job);
        }



        //Update job
        [HttpPut("update-job/{id}")]
        [Authorize]
        public IActionResult UpdateJob(int id, [FromBody] UpdateJobDto request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var job = _context.Jobs.FirstOrDefault(j => j.Id == id);

            if (job == null)
                return NotFound();

            if (job.UserId != userId)
                return Unauthorized();

            //Delete Relative Quotes
            var quotes = _context.Quotes.Where(q => q.JobId == job.Id).ToList();
            _context.Quotes.RemoveRange(quotes);



            job.Title = request.Title;
            job.Description = request.Description;
            job.Category = request.Category;
            job.Budget = request.Budget;
            job.Deadline = request.Deadline;
            job.State = request.State;
            job.AcceptedQuoteId = null;



            _context.SaveChanges();

            return Ok(new { message = "Job updated successfully" });
        }


        //Delete a job
        [HttpDelete("delete-job/{id}")]
        [Authorize]
        public IActionResult DeleteJob(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var job = _context.Jobs.FirstOrDefault(j => j.Id == id);

            if (job == null)
                return NotFound();

            if (job.UserId != userId)
                return Unauthorized();

            var quotes = _context.Quotes.Where(q => q.JobId == job.Id).ToList();
            _context.Quotes.RemoveRange(quotes);


            _context.Jobs.Remove(job);
            _context.SaveChanges();

            return Ok(new { message = "Job deleted successfully" });
        }



        [HttpGet("view-my-jobs")]
        [Authorize]
        public IActionResult GetMyJobs()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var jobs = _context.Jobs
                .Where(j => j.UserId == userId)
                .Include(j => j.User)
                .Select(j => new JobResponseDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    Description = j.Description,
                    Category = j.Category,
                    CreatedAt = j.CreatedAt,
                    Username = j.User.UserName,
                    Budget = j.Budget,
                    Deadline = j.Deadline,
                    State = j.State.ToString(),
                    AcceptedQuoteId = j.AcceptedQuoteId
                })
                .ToList();

            return Ok(jobs);
        }

    }


}