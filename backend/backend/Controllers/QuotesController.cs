﻿using backend.Data;
using backend.Dto.QuoteDto;
using backend.Enum;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/quotes")]
    public class QuotesController : ControllerBase
    {
        private readonly DataContext _context;

        public QuotesController(DataContext context)
        {
            _context = context;
        }

        
        [HttpPost("create-quote")]
        [Authorize]
        public IActionResult CreateQuote([FromBody] CreateQuoteDto request)
        {
            // Get the UserId from the token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            // Find the freelancer based on the UserId
            var freelancer = _context.Freelancers
                .Include(f => f.User)
                .FirstOrDefault(f => f.UserId == userId);

            if (freelancer == null)
            {
                return BadRequest("Only freelancers can create quotes.");
            }

            var job = _context.Jobs.Find(request.JobId);
            if (job == null)
            {
                return NotFound($"Job with ID {request.JobId} does not exist.");
            }

            if (job.UserId == userId)
            {
                return BadRequest("You cannot create a quote for a job that belongs to you.");
            }


            var quote = new Quote
            {
                FreelancerId = freelancer.FreelancerId,
                JobId = request.JobId,
                Price = request.Price,
                Comment = request.Comment
            };

            _context.Quotes.Add(quote);

            //Create Notification for the job poster
            
            var jobPoster = _context.Users.Find(job.UserId);
            if (jobPoster != null)
            {
                var notification = new Notification
                {
                    UserId = jobPoster.Id,
                    Message = $"Ο χρήστης {freelancer.User.UserName} έκανε προσφορά για τη δουλειά σου: '{job.Title}'",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Notifications.Add(notification);
            }





            _context.SaveChanges();

            var response = new QuoteResponseDto
            {
                Id = quote.Id,
                JobId = quote.JobId,
                JobTitle = job.Title,
                FreelancerId = freelancer.FreelancerId,
                FreelancerUsername = freelancer.User.UserName,
                Price = quote.Price,
                Comment = quote.Comment
            };

            return CreatedAtAction(nameof(GetAllQuotesForAJobById), new { jobId = quote.JobId }, response);
        }

        
        [HttpDelete("delete-quote/{id}")]
        [Authorize]
        public IActionResult DeleteQuoteById(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var freelancer = _context.Freelancers.FirstOrDefault(f => f.UserId == userId);
            if (freelancer == null)
                return BadRequest("Only freelancers can create quotes.");

            var quote = _context.Quotes
             .Include(q => q.Job)
             .FirstOrDefault(q => q.Id == id);
            if (quote == null)
                return NotFound();

            if (quote.FreelancerId != freelancer.FreelancerId)
                return BadRequest("Only freelancers can create quotes.");


            if (quote.Job != null && quote.Job.AcceptedQuoteId == quote.Id)
            {
                quote.Job.AcceptedQuoteId = null;
                quote.Job.State = JobState.Open;
            }



            _context.Quotes.Remove(quote);
            _context.SaveChanges();

            return Ok(new { message = "Quote deleted successfully." });
        }

       
        [HttpDelete("delete-my-quotes")]
        [Authorize]
        public IActionResult DeleteAllMyQuotes()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId == null)
            {
                return Unauthorized();
            }

            var freelancer = _context.Freelancers.FirstOrDefault(f => f.UserId == userId);
            if (freelancer == null)
                return BadRequest("Only freelancers can create quotes.");

            var quotes = _context.Quotes
                .Include(q => q.Job)
                .Where(q => q.FreelancerId == freelancer.FreelancerId)
                .ToList();

            if (!quotes.Any())
                return Ok(new { message = "You have no quotes to delete." });


            // Cancel accepted quotes
            foreach (var quote in quotes)
            {
                if (quote.Job != null && quote.Job.AcceptedQuoteId == quote.Id)
                {
                    quote.Job.AcceptedQuoteId = null;
                    quote.Job.State = JobState.Open;
                }
            }


            _context.Quotes.RemoveRange(quotes);
            _context.SaveChanges();

            return Ok(new { message = "All your quotes have been deleted." });
        }

        
        [HttpGet("view-quotes-for-job/{jobId}")]
        public IActionResult GetAllQuotesForAJobById(int jobId)
        {
            var job = _context.Jobs.Find(jobId);
            if (job == null)
            {
                return NotFound($"Job with ID {jobId} not found.");
            }

            var quotes = _context.Quotes
                .Include(q => q.Freelancer)
                .Where(q => q.JobId == jobId)
                .Select(q => new QuoteResponseDto
                {
                    Id = q.Id,
                    JobId = q.JobId,
                    JobTitle = job.Title,
                    FreelancerId = q.FreelancerId,
                    FreelancerUsername = q.Freelancer.User.UserName,
                    Price = q.Price,
                    Comment = q.Comment
                })
                .ToList();

            return Ok(quotes);
        }




        [HttpPost("accept-quote/{quoteId}")]
        [Authorize]
        public IActionResult AcceptQuote(int quoteId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var quote = _context.Quotes
                .Include(q => q.Job)
                    .ThenInclude(j => j.User)
                .Include(q => q.Freelancer)
                    .ThenInclude(f => f.User)
                .FirstOrDefault(q => q.Id == quoteId);

            if (quote == null)
                return NotFound("Quote not found.");

            var job = quote.Job;

            if (job == null)
                return NotFound("Associated job not found.");

            if (job.UserId != userId)
                return BadRequest("You are not the owner of this job.");

            if (job.State != JobState.Open)
                return BadRequest("Only open jobs can accept quotes.");

            // Set accepted quote and update job state
            job.AcceptedQuoteId = quoteId;
            job.State = JobState.InProgress;



            // Send notification to freelancer
            var notification = new Notification
            {
                UserId = quote.Freelancer.UserId,
                Message = $"Η προσφορά σου με ID {quoteId} για τη δουλειά '{job.Title}' έγινε αποδεκτή!",
                CreatedAt = DateTime.UtcNow
            };
            _context.Notifications.Add(notification);





            _context.SaveChanges();

            return Ok(new
            {
                message = "Quote accepted successfully.",
                jobId = job.Id,
                acceptedQuoteId = quoteId,
                jobState = job.State.ToString()
            });
        }


        [HttpPost("cancel-quote/{quoteId}")]
        [Authorize]
        public IActionResult CancelAcceptedQuote(int quoteId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            
            var quote = _context.Quotes
                .Include(q => q.Job)
                    .ThenInclude(j => j.User)
                .Include(q => q.Freelancer)
                    .ThenInclude(f => f.User)
                .FirstOrDefault(q => q.Id == quoteId);

            if (quote == null)
                return NotFound("Quote not found.");

            var job = quote.Job;
            if (job == null)
                return NotFound("Associated job not found.");

            
            if (job.AcceptedQuoteId != quoteId)
                return BadRequest("This quote is not the accepted quote for the job.");

            bool isJobOwner = job.UserId == userId;
            bool isAcceptedFreelancer = quote.Freelancer.UserId == userId;

            if (!isJobOwner && !isAcceptedFreelancer)
                return BadRequest("You are not allowed to cancel this accepted quote.");

            
         



            // Send notification to the other party
            Notification notification = null;

            if (isJobOwner)
            {
                notification = new Notification
                {
                    UserId = quote.Freelancer.UserId,
                    Message = $"Ο '{job.User.UserName}' ακύρωσε την αποδοχή της προσφοράς σου για τη δουλειά '{job.Title}'.",
                    CreatedAt = DateTime.UtcNow
                };
            }
            else if (isAcceptedFreelancer)
            {
                notification = new Notification
                {
                    UserId = job.UserId,
                    Message = $"Ο '{quote.Freelancer.User.UserName}' ακύρωσε την αποδοχή της προσφοράς του για τη δουλειά '{job.Title}'.",
                    CreatedAt = DateTime.UtcNow
                };
            }



            if (notification != null)
                _context.Notifications.Add(notification);

            job.State = JobState.Open;
            job.AcceptedQuoteId = null;







            _context.SaveChanges();

            return Ok(new
            {
                message = "Accepted quote has been canceled. The job is now open again.",
                jobId = job.Id,
                jobState = job.State.ToString()
            });
        }

        [HttpGet("view-all-my-quotes")]
        [Authorize]
        public IActionResult ViewAllMyQuotes()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

           
            var freelancer = _context.Freelancers
                .FirstOrDefault(f => f.UserId == userId);

           
            if (freelancer == null)
            {
                return BadRequest("You are not a freelancer.");
            }

           
            var quotes = _context.Quotes
                .Include(q => q.Job)
                .Where(q => q.FreelancerId == freelancer.FreelancerId)
                .Select(q => new QuoteResponseDto
                {
                    Id = q.Id,
                    JobId = q.JobId,
                    JobTitle = q.Job.Title,
                    FreelancerId = q.FreelancerId,
                    FreelancerUsername = q.Freelancer.User.UserName,
                    Price = q.Price,
                    Comment = q.Comment
                })
                .ToList();

            
            if (!quotes.Any())
            {
                return Ok(new { message = "You have no quotes." });
            }

           
            return Ok(quotes);
        }


        [HttpGet("view-my-accepted-quotes")]
        [Authorize]
        public IActionResult ViewMyAcceptedQuotes()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var freelancer = _context.Freelancers
                .FirstOrDefault(f => f.UserId == userId);

           
            if (freelancer == null)
            {
                return BadRequest("You are not a freelancer.");
            }

            
            var acceptedQuotes = _context.Quotes
                .Include(q => q.Job)
                .Where(q => q.FreelancerId == freelancer.FreelancerId && q.Job.AcceptedQuoteId == q.Id)
                .Select(q => new QuoteResponseDto
                {
                    Id = q.Id,
                    JobId = q.JobId,
                    JobTitle = q.Job.Title,
                    FreelancerId = q.FreelancerId,
                    FreelancerUsername = q.Freelancer.User.UserName,
                    Price = q.Price,
                    Comment = q.Comment
                })
                .ToList();

            
            if (!acceptedQuotes.Any())
            {
                return Ok(new { message = "You have no accepted quotes." });
            }

            
            return Ok(acceptedQuotes);
        }


        [HttpGet("view-quotes-for-my-jobs")]
        [Authorize]
        public IActionResult GetAllQuotesForJobs()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
               
            var jobs = _context.Jobs
                .Where(j => j.UserId == userId)
                .Select(j => j.Id)
                .ToList();

            if (!jobs.Any())
            {
                return NotFound("No jobs found for the current user.");
            }

            // Βρίσκουμε τα quotes για τα jobs που ανήκουν στον χρήστη
            var quotes = _context.Quotes
                .Include(q => q.Freelancer)
                .Where(q => jobs.Contains(q.JobId))
                .Select(q => new QuoteResponseDto
                {
                    Id = q.Id,
                    JobId = q.JobId,
                    JobTitle = q.Job.Title,
                    FreelancerId = q.FreelancerId,
                    FreelancerUsername = q.Freelancer.User.UserName,
                    Price = q.Price,
                    Comment = q.Comment
                })
                .ToList();

            if (!quotes.Any())
            {
                return Ok(new { message = "No quotes found for your jobs." });
            }

            return Ok(quotes);
        }


    }
}
