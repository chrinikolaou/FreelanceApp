namespace backend.Dto.QuoteDto
{
    public class QuoteEvaluationResultDto
    {
        public double Rating { get; set; }
        public int CompletedJobs { get; set; }
        public decimal BudgetDifference { get; set; }
        public int Score { get; set; }
        public string Decision { get; set; }
    }
}
