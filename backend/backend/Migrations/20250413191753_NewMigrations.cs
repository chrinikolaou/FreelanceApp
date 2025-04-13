using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class NewMigrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AcceptedQuoteId",
                table: "Job",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Job_AcceptedQuoteId",
                table: "Job",
                column: "AcceptedQuoteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Job_Quote_AcceptedQuoteId",
                table: "Job",
                column: "AcceptedQuoteId",
                principalTable: "Quote",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Job_Quote_AcceptedQuoteId",
                table: "Job");

            migrationBuilder.DropIndex(
                name: "IX_Job_AcceptedQuoteId",
                table: "Job");

            migrationBuilder.DropColumn(
                name: "AcceptedQuoteId",
                table: "Job");
        }
    }
}
