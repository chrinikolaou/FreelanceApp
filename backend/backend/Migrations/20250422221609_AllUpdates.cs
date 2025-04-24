using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AllUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Freelancer");

            migrationBuilder.CreateTable(
                name: "CompletedJob",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    JobId = table.Column<int>(type: "int", nullable: false),
                    JobTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JobDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Budget = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    JobPostedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    JobCategory = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuoteId = table.Column<int>(type: "int", nullable: false),
                    QuotePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    QuoteMessage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    UserUsername = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FreelancerId = table.Column<int>(type: "int", nullable: false),
                    FreelancerUserId = table.Column<int>(type: "int", nullable: false),
                    FreelancerUsername = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FreelancerUserEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompletedJob", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rating",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FreelancerId = table.Column<int>(type: "int", nullable: false),
                    CompletedJobId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Rate = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rating", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rating_Freelancer_FreelancerId",
                        column: x => x.FreelancerId,
                        principalTable: "Freelancer",
                        principalColumn: "FreelancerId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Rating_FreelancerId",
                table: "Rating",
                column: "FreelancerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompletedJob");

            migrationBuilder.DropTable(
                name: "Rating");

            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Freelancer",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
