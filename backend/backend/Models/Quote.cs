﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Quote
    {
        public int Id { get; set; }

        [Required]
        public int FreelancerId { get; set; }

        [ForeignKey("FreelancerId")] 
        public Freelancer Freelancer { get; set; }


        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [MaxLength(1000)]
        public string Comment { get; set; }

        [Required]
        public int JobId { get; set; }
        
        [ForeignKey("JobId")]
        public Job Job { get; set; }

       
    }
}
