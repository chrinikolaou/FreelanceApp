using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Freelancer> Freelancers { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<CompletedJob> CompletedJobs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<Freelancer>().ToTable("Freelancer");
            modelBuilder.Entity<Job>().ToTable("Job");
            modelBuilder.Entity<Quote>().ToTable("Quote");
            modelBuilder.Entity<Notification>().ToTable("Notification");
            modelBuilder.Entity<Rating>().ToTable("Rating");
            modelBuilder.Entity<CompletedJob>().ToTable("CompletedJob");

            // Quote - Job relationship
            modelBuilder.Entity<Quote>()
                .HasOne(q => q.Job)
                .WithMany() // no navigation property in Job
                .HasForeignKey(q => q.JobId)
                .OnDelete(DeleteBehavior.Cascade); // delete quotes if job deleted

            // Quote - Freelancer relationship
            modelBuilder.Entity<Quote>()
                .HasOne(q => q.Freelancer)
                .WithMany() // no navigation property in Freelancer
                .HasForeignKey(q => q.FreelancerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Quote)
                .WithMany()
                .HasForeignKey(n => n.QuoteId)
                .OnDelete(DeleteBehavior.SetNull);


            //Freelancer - User relationShip
            modelBuilder.Entity<Freelancer>()
                .HasKey(f => f.FreelancerId);

            modelBuilder.Entity<Freelancer>()
                .HasOne(f => f.User)
                .WithOne()
                .HasForeignKey<Freelancer>(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            //User-Notification
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany() // δεν έχει navigation στο User
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Restrict);


            // Freelancer - Rating relationship
            //modelBuilder.Entity<Rating>()
            //    .HasOne(r => r.Freelancer)
            //    .WithMany()
            //    .HasForeignKey(r => r.FreelancerId)
            //    .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Rating>()
            .HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.CompletedJob)
                .WithMany()
                .HasForeignKey(r => r.CompletedJobId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.Freelancer)
                .WithMany()
                .HasForeignKey(r => r.FreelancerId)
                .OnDelete(DeleteBehavior.Restrict); 
        }


    }




}
