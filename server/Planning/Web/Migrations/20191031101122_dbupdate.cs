using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Web.Migrations
{
    public partial class dbupdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Jobs",
                columns: table => new
                {
                    JobID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(nullable: false),
                    Time = table.Column<DateTime>(nullable: false),
                    Describe = table.Column<string>(nullable: true),
                    CompletionStatus = table.Column<byte>(nullable: false),
                    DeleteStatus = table.Column<byte>(nullable: false),
                    CollectTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jobs", x => x.JobID);
                });

            migrationBuilder.CreateTable(
                name: "Targets",
                columns: table => new
                {
                    TargetID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Time = table.Column<int>(nullable: false),
                    UserID = table.Column<int>(nullable: false),
                    TargetType = table.Column<byte>(nullable: false),
                    Describe = table.Column<string>(nullable: true),
                    CompletionStatus = table.Column<byte>(nullable: false),
                    DeleteStatus = table.Column<byte>(nullable: false),
                    CollectTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Targets", x => x.TargetID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Password = table.Column<string>(nullable: true),
                    UnionID = table.Column<string>(nullable: true),
                    Mobile = table.Column<string>(nullable: true),
                    VipLevel = table.Column<string>(nullable: true),
                    RegTime = table.Column<DateTime>(nullable: false),
                    RegIP = table.Column<long>(nullable: false),
                    LastLogonTime = table.Column<DateTime>(nullable: false),
                    LastLogonIP = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Jobs");

            migrationBuilder.DropTable(
                name: "Targets");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
