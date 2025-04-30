using backend.Enum;
using backend.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Dto.QuoteDto
{
    public class QuoteResponseDto
    {

        public QuoteResponseDto() { }
        public QuoteResponseDto(Quote? quote) {

            if (quote == null) return;

            this.Id = quote.Id;
            this.JobId = quote.JobId;
            this.JobTitle = quote.Job.Title;
            this.Job = quote.Job;
            this.FreelancerId = quote.FreelancerId;
            this.FreelancerUsername = quote.Freelancer.User.UserName;
            this.Price = quote.Price;
            this.Comment = quote.Comment;
            this.Decision = quote.EvaluationDecision;
            this.QuoteState = quote.QuoteState;
            this.Username = quote.Job.User.UserName;
            
        }


        public int Id { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;

        [ForeignKey("JobId")]
        public Job Job { get; set; }
        public int FreelancerId { get; set; }
        public string FreelancerUsername { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Comment { get; set; } = string.Empty;

        public string? Decision { get; set; }
        public QuoteState QuoteState { get; set; }
        public string Username { get; set; } = string.Empty;


    }
}
