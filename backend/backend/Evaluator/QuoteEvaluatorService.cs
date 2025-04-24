using backend.Data;
using backend.Dto.QuoteDto;
using backend.Models;

namespace backend.Evaluator
{
    public class QuoteEvaluatorService : IQuoteEvaluator
    {
        private readonly DataContext _context;
        public QuoteEvaluatorService(DataContext context)
        {
            _context = context;
        }


        public QuoteEvaluationResultDto EvaluateQuote(Freelancer freelancer, Job job, decimal quotePrice)
        {
            var ratings = _context.Ratings
                .Where(r => r.FreelancerId == freelancer.FreelancerId)
                .Select(r => r.Rate)
                .ToList();

            double averageRating = ratings.Any() ? ratings.Average() : 0;
            
          
            int completedJobsCount = freelancer.CompletedJobs;

            decimal budget = job.Budget;
            bool isBudgetReasonable = Math.Abs(budget - quotePrice) <= (budget * 0.25m);

            int score = 0;
            if (averageRating >= 4.0) score++;
            if (completedJobsCount >= 3) score++;
            if (isBudgetReasonable) score++;

            string decision;
            if (score == 3)
                decision = "Υψηλή πιθανότητα επιτυχίας";
            else if (score == 2)
                decision = "Μέτρια πιθανότητα";
            else
                decision = "Δεν πληροί τα κριτήρια";

            return new QuoteEvaluationResultDto
            {
                Rating = averageRating,
                CompletedJobs = completedJobsCount,
                BudgetDifference = Math.Abs(budget - quotePrice),
                Score = score,
                Decision = decision
            };
        }









    }
}
