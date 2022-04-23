using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SIProjectSet1.Migrations
{
    public partial class AddDebug : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DebugLog",
                table: "Licences",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DebugLog",
                table: "Licences");
        }
    }
}
