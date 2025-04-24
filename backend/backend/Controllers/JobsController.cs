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



/*       //Update job
        [HttpPut("update-job/{id}")]
        [Authorize]
        public IActionResult UpdateJob(int id, [FromBody] UpdateJobDto request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (userId == null)
            {
                return Unauthorized();
            }

            var job = _context.Jobs
                .Include(j => j.User)
                .Include(j => j.AcceptedQuote)
                .FirstOrDefault(j => j.Id == id);

            if (job == null)
                return NotFound();

            if (job.UserId != userId)
                return Unauthorized();


            if (job.AcceptedQuoteId != null)
            {
                job.State = JobState.Open;
                job.AcceptedQuoteId = null;
                job.AcceptedQuote = null;
                _context.Jobs.Update(job);
                _context.SaveChanges();
            }

            //Delete Relative Quotes
            var quotes = _context.Quotes
                .Include(q => q.Job)
                    .ThenInclude(j => j.User)
                .Include(q => q.Freelancer)
                    .ThenInclude(f => f.User)
                .Where(q => q.JobId == job.Id)
                .ToList();



            //Send Notifications
            foreach (var quote in quotes)
            {
                string message = $"Το quote σας για την δουλειά '{job.Title}' έχει αφαιρεθεί, καθώς η δουλειά ανανεώθηκε.";

               
                var notification = new Notification
                {
                    UserId = quote.Freelancer.UserId,
                    Message = message,
                    CreatedAt = DateTime.UtcNow,
                };

               
                _context.Notifications.Add(notification);
            }



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

*/
        //Delete a job
        [HttpDelete("delete-job/{id}")]
        [Authorize]
        public IActionResult DeleteJob(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (userId == null)
            {
                return Unauthorized();
            }

            var job = _context.Jobs
                .Include(j => j.User)
                .Include(j => j.AcceptedQuote)
                .FirstOrDefault(j => j.Id == id);

            if (job == null)
                return NotFound();

            if (job.UserId != userId)
                return Unauthorized();

            
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
                string message = $"Το quote σας με Id '{quote.Id}' για την δουλειά '{job.Title}' διαγράφηκε, καθώς η δουλειά διαγράφηκε.";

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

        [HttpPost("{jobId}/freelancer-complete")]
        [Authorize]
        public IActionResult MarkJobAsCompletedByFreelancer(int jobId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId == null)
            {
                return Unauthorized();
            }


            var job = _context.Jobs
                .Include(j => j.AcceptedQuote)
                    .ThenInclude(q => q.Freelancer)
                .Include(j => j.User)
                .FirstOrDefault(j => j.Id == jobId);

            if (job == null)
                return NotFound("Job not found");

            if (job.AcceptedQuote == null)
                return BadRequest("This job has no accepted quote");

            if (job.AcceptedQuote.Freelancer.UserId != userId)
                return Unauthorized("Only the assigned freelancer can mark the job as completed");

            if (job.State == JobState.Completed || job.State == JobState.Pending)
                return BadRequest("This job is already completed or pending confirmation");

            // Αλλαγή κατάστασης
            job.State = JobState.Pending;
            _context.Jobs.Update(job);

            // Ειδοποίηση στον job owner
            var notification = new Notification
            {
                UserId = job.UserId,
                Message = $"Ο freelancer ολοκλήρωσε τη δουλειά '{job.Title}'. Παρακαλώ επιβεβαιώστε την ολοκλήρωση.",
                CreatedAt = DateTime.UtcNow
            };
            _context.Notifications.Add(notification);

            _context.SaveChanges();

            return Ok(new { message = "Job marked as completed. Awaiting owner confirmation." });
        }


        [HttpPost("{jobId}/owner-confirm-complete")]
        [Authorize]
        public IActionResult ConfirmJobCompletionByOwner(int jobId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId == null)
            {
                return Unauthorized();
            }

            var job = _context.Jobs
                .Include(j => j.User)
                .Include(j => j.AcceptedQuote)
                    .ThenInclude(q => q.Freelancer)
                        .ThenInclude(f => f.User)
                .FirstOrDefault(j => j.Id == jobId);

            if (job == null)
                return NotFound("Job not found");

            if (job.UserId != userId)
                return Unauthorized("Only the job owner can confirm the completion");

            if (job.State != JobState.Pending)
                return BadRequest("Job is not pending confirmation");

            if(job.AcceptedQuote == null)
                return BadRequest("Job has no accepted Quote");

            var freelancer = _context.Freelancers.FirstOrDefault(f => f.FreelancerId == job.AcceptedQuote.Freelancer.FreelancerId);
            if (freelancer == null)
                return NotFound("Freelancer not found");


            var completedJob = new CompletedJob
            {
                JobId = job.Id,
                JobTitle = job.Title,
                JobDescription = job.Description,
                JobCategory = job.Category,
                JobPostedDate = job.CreatedAt,
                Budget = job.Budget,

                QuoteId = job.AcceptedQuote.Id,
                QuotePrice = job.AcceptedQuote.Price,
                QuoteMessage = job.AcceptedQuote.Comment,

                UserId = job.User.Id,
                UserUsername = job.User.UserName,
                UserEmail = job.User.Email,

                FreelancerId = job.AcceptedQuote.Freelancer.FreelancerId,
                FreelancerUserId = job.AcceptedQuote.Freelancer.User.Id,
                FreelancerUsername = job.AcceptedQuote.Freelancer.User.UserName,
                FreelancerUserEmail = job.AcceptedQuote.Freelancer.User.Email,

                CompletedAt = DateTime.UtcNow
            };

            _context.CompletedJobs.Add(completedJob);

            var quotes = _context.Quotes
               .Include(q => q.Job)
                   .ThenInclude(j => j.User)
               .Include(q => q.Freelancer)
                   .ThenInclude(f => f.User)
               .Where(q => q.JobId == job.Id)
               .ToList();

            // Προαιρετικά: Ειδοποίηση σε freelancers για διαγραφή quotes
            foreach (var quote in quotes)
            {
                //if (job.AcceptedQuoteId == quote.Id) continue;
                var quoteNotification = new Notification
                {
                    UserId = quote.Freelancer.UserId,
                    Message = $"Το quote σας με Id '{quote.Id}' για τη δουλειά '{job.Title}' αφαιρέθηκε, καθώς η δουλειά ολοκληρώθηκε.",
                    CreatedAt = DateTime.UtcNow,
                };
                _context.Notifications.Add(quoteNotification);
            }

            freelancer.CompletedJobs += 1;
            _context.Freelancers.Update(freelancer);

            var notification = new Notification
            {
                UserId = job.AcceptedQuote.Freelancer.UserId,
                Message = $"Ο πελάτης επιβεβαίωσε την ολοκλήρωση της δουλειάς '{job.Title}'. Συγχαρητήρια!",
                CreatedAt = DateTime.UtcNow
            };
            _context.Notifications.Add(notification);


            //Ρυθμιση των foreign keys πριν διαγράψω τα quotes
            if (job.AcceptedQuoteId != null)
            {
                job.AcceptedQuoteId = null;
                job.AcceptedQuote = null;
                _context.Jobs.Update(job);
                _context.SaveChanges();
            }

            // Διαγραφή των quotes
            _context.Quotes.RemoveRange(quotes);

            // Διαγραφή της δουλειάς από τον κύριο πίνακα
            _context.Jobs.Remove(job);


            // Increase freelancer's completed job count
           

            _context.SaveChanges();

            return Ok(new { message = "Job marked as completed successfully." });
        }



        [HttpPost("{jobId}/owner-deny-complete")]
        [Authorize]
        public IActionResult DenyJobCompletionByOwner(int jobId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId == null)
            {
                return Unauthorized();
            }

            var job = _context.Jobs
                .Include(j => j.User)
                .Include(j => j.AcceptedQuote)
                    .ThenInclude(q => q.Freelancer)
                .FirstOrDefault(j => j.Id == jobId);

            if (job == null)
                return NotFound("Job not found");

            if (job.UserId != userId)
                return Unauthorized("Only the job owner can deny the completion");

            if (job.State != JobState.Pending)
                return BadRequest("Job is not pending confirmation");

            // Αλλαγή κατάστασης σε InProgress
            job.State = JobState.InProgress;
            _context.Jobs.Update(job);

            // Ειδοποίηση στον freelancer
            var notification = new Notification
            {
                UserId = job.AcceptedQuote.Freelancer.UserId,
                Message = $"Ο πελάτης απέρριψε την ολοκλήρωση της δουλειάς '{job.Title}'. Παρακαλώ επικοινωνήστε για διευκρινίσεις.",
                CreatedAt = DateTime.UtcNow
            };
            _context.Notifications.Add(notification);

            _context.SaveChanges();

            return Ok(new { message = "Completion denied. Job set back to In Progress." });
        }


    }


}