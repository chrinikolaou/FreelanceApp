﻿using backend.Dto.RatingDto;
using backend.Models;
using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend.Enum;
using Microsoft.EntityFrameworkCore;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/ratings")]
    public class RatingsController : Controller
    {
        private readonly DataContext _context;

        public RatingsController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize]
        public IActionResult CreateRating([FromBody] CreateRatingDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (userId == null)
                Unauthorized();

            var completedJob = _context.CompletedJobs
                .FirstOrDefault(j => j.JobId == dto.CompletedJobId && j.UserId == userId);

            if (completedJob == null)
                return BadRequest("You can only rate a freelancer for a job you own that has been completed.");

            var freelancerId = completedJob.FreelancerId;
            var freelancer = _context.Freelancers.FirstOrDefault(f => f.FreelancerId == freelancerId);
            if (freelancer == null)
                return NotFound("Freelancer not found.");


            // Prevent duplicate rating for same job
            var alreadyRated = _context.Ratings.Any(r =>
            r.UserId == userId &&
            r.FreelancerId == freelancerId &&
            r.CompletedJobId == dto.CompletedJobId);

            if (alreadyRated)
                return BadRequest("You have already rated this job for this freelancer.");

            var rating = new Rating
            {
                FreelancerId = freelancerId,
                CompletedJobId = dto.CompletedJobId,
                UserId = userId,
                Rate = dto.Rate,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Ratings.Add(rating);
            _context.SaveChanges();

            return Ok(new { message = "Rating submitted successfully." });
        }

        [HttpGet("received/{freelancerId}")]
        [Authorize]
        public IActionResult GetRatingsForFreelancer(int freelancerId)
        {
            var freelancer = _context.Freelancers.FirstOrDefault(f => f.FreelancerId == freelancerId);
            if (freelancer == null)
                return NotFound("Freelancer not found");

            var ratings = _context.Ratings
                .Where(r => r.FreelancerId == freelancerId)
                .OrderByDescending(r => r.CreatedAt)
                .ToList();

            var result = ratings.Select(r =>
            {
                var job = _context.CompletedJobs.FirstOrDefault(j => j.JobId == r.CompletedJobId);
                var user = _context.Users.Find(r.UserId);

                return new ViewRatingDto
                {
                    Id = r.Id,
                    Rate = r.Rate,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    JobId = r.CompletedJobId,
                    JobTitle = job?.JobTitle,
                    UserId = r.UserId,
                    Username = user?.UserName
                };
            }).ToList();

            return Ok(result);
        }

        [HttpGet("sent/{userId}")]
        [Authorize]
        public IActionResult GetRatingsFromUser(int userId)
        {
            var user = _context.Users.Find(userId);
            if (user == null)
                return NotFound("User not found");

            var ratings = _context.Ratings
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ViewRatingDto
                {
                    Id = r.Id,
                    Rate = r.Rate,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    JobId = r.CompletedJobId,
                    JobTitle = r.CompletedJob.JobTitle,
                    UserId = r.UserId,
                    Username = r.User.UserName,
                    FreelancerUsername = r.CompletedJob.FreelancerUsername,
                })
                .ToList();

            return Ok(ratings);
        }



        [HttpGet("received")]
        [Authorize]
        public IActionResult GetMyRatings()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var freelancer = _context.Freelancers.FirstOrDefault(f => f.UserId == userId);
            if (freelancer == null)
                return Unauthorized("You are not a freelancer");

            var ratings = _context.Ratings
                .Where(r => r.FreelancerId == freelancer.FreelancerId)
                .OrderByDescending(r => r.CreatedAt)
                .ToList();

            var result = ratings.Select(r =>
            {
                var job = _context.CompletedJobs.FirstOrDefault(j => j.JobId == r.CompletedJobId);
                var user = _context.Users.Find(r.UserId);

                return new ViewRatingDto
                {
                    Id = r.Id,
                    Rate = r.Rate,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    JobId = r.CompletedJobId,
                    JobTitle = job?.JobTitle,
                    UserId = r.UserId,
                    Username = user?.UserName
                };
            }).ToList();

            return Ok(result);

        }

        [HttpGet("sent")]
        [Authorize]
        public IActionResult GetSentRatings()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var ratings = _context.Ratings
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ViewRatingDto
                {
                    Id = r.Id,
                    Rate = r.Rate,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    JobId = r.CompletedJobId,
                    JobTitle = r.CompletedJob.JobTitle,
                    UserId = r.UserId,
                    Username = r.User.UserName,
                    FreelancerUsername = r.Freelancer.User.UserName
                })
                .ToList();

            return Ok(ratings);
        }



        [HttpGet("{ratingId}")]
        [Authorize]
        public IActionResult GetFreelancerRatingById(int ratingId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var rating = _context.Ratings
                .FirstOrDefault(r => r.Id == ratingId);

            if (rating == null)
                return NotFound("Rating not found. " + ratingId);

            var job = _context.CompletedJobs.Find(rating.CompletedJobId);
            var user = _context.Users.Find(rating.UserId);

            var result = new ViewRatingDto
            {
                Id = rating.Id,
                Rate = rating.Rate,
                Comment = rating.Comment,
                CreatedAt = rating.CreatedAt,
                JobId = rating.CompletedJobId,
                JobTitle = job?.JobTitle,
                UserId = rating.UserId,
                Username = user?.UserName,
                FreelancerUsername = rating.Freelancer.User.UserName
            };

            return Ok(result);
        }

        [HttpGet("completedJob/{completedJobId}")]
        [Authorize]
        public IActionResult GetCompletedJobRating(int completedJobId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            
            var rating = _context.Ratings
                .FirstOrDefault(r => r.CompletedJobId == completedJobId);

            if (rating == null)
                return NotFound("Rating not found. " + completedJobId);

            var job = _context.CompletedJobs.Find(rating.CompletedJobId);
            var user = _context.Users.Find(rating.UserId);

            var result = new ViewRatingDto
            {
                Id = rating.Id,
                Rate = rating.Rate,
                Comment = rating.Comment,
                CreatedAt = rating.CreatedAt,
                JobId = rating.CompletedJobId,
                JobTitle = job?.JobTitle,
                UserId = rating.UserId,
                Username = user?.UserName
            };

            return Ok(result);
        }


    }
}
