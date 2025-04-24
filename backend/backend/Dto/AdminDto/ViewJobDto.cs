using backend.Enum;
using backend.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Dto.AdminDto
{
    public class ViewJobDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public decimal Budget { get; set; }
        public DateTime Deadline { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserEmail { get; set; }
        public string UserName { get; set; }
        public string State { get; set; }
        public int? AcceptedQuoteId { get; set; }


    }
}
