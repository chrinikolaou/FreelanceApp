using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class NewDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Freelancer_User_Id",
                table: "Freelancer");

            migrationBuilder.DropForeignKey(
                name: "FK_Quote_Freelancer_FreelancerId",
                table: "Quote");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Freelancer",
                table: "Freelancer");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Freelancer",
                newName: "UserId");

            migrationBuilder.AddColumn<int>(
                name: "FreelancerId",
                table: "Freelancer",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Freelancer",
                table: "Freelancer",
                column: "FreelancerId");

            migrationBuilder.CreateIndex(
                name: "IX_Freelancer_UserId",
                table: "Freelancer",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Freelancer_User_UserId",
                table: "Freelancer",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Quote_Freelancer_FreelancerId",
                table: "Quote",
                column: "FreelancerId",
                principalTable: "Freelancer",
                principalColumn: "FreelancerId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Freelancer_User_UserId",
                table: "Freelancer");

            migrationBuilder.DropForeignKey(
                name: "FK_Quote_Freelancer_FreelancerId",
                table: "Quote");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Freelancer",
                table: "Freelancer");

            migrationBuilder.DropIndex(
                name: "IX_Freelancer_UserId",
                table: "Freelancer");

            migrationBuilder.DropColumn(
                name: "FreelancerId",
                table: "Freelancer");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Freelancer",
                newName: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Freelancer",
                table: "Freelancer",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Freelancer_User_Id",
                table: "Freelancer",
                column: "Id",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Quote_Freelancer_FreelancerId",
                table: "Quote",
                column: "FreelancerId",
                principalTable: "Freelancer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
