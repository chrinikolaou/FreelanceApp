using backend.Dto.QuoteDto;
using backend.Models;

namespace backend.Evaluator
{
    public interface IQuoteEvaluator
    {
        QuoteEvaluationResultDto EvaluateQuote(Freelancer freelancer, Job job, decimal quotePrice);
    }
}
