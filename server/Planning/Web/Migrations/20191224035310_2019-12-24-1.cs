using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Web.Migrations
{
    public partial class _201912241 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLogonIP",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastLogonTime",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CompletionStatus",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "DeleteStatus",
                table: "Jobs");

            migrationBuilder.AlterColumn<int>(
                name: "VipLevel",
                table: "Users",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UnionID",
                table: "Users",
                maxLength: 32,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "RegIP",
                table: "Users",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                maxLength: 32,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Mobile",
                table: "Users",
                maxLength: 32,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AvatarUrl",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Users",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Users",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<byte>(
                name: "Gender",
                table: "Users",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<string>(
                name: "LastLoginIP",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginTime",
                table: "Users",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Nickname",
                table: "Users",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OpenID",
                table: "Users",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Province",
                table: "Users",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Describe",
                table: "Targets",
                maxLength: 140,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Describe",
                table: "Jobs",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<byte>(
                name: "CompletionState",
                table: "Jobs",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<byte>(
                name: "DeleteState",
                table: "Jobs",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.CreateTable(
                name: "LifelongTarget",
                columns: table => new
                {
                    UserID = table.Column<int>(nullable: false),
                    Describe = table.Column<string>(maxLength: 560, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LifelongTarget", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "MonthTarget",
                columns: table => new
                {
                    TargetID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MonthID = table.Column<int>(nullable: false),
                    UserID = table.Column<int>(nullable: false),
                    Describe = table.Column<string>(maxLength: 140, nullable: true),
                    CompletionStatus = table.Column<byte>(nullable: false),
                    DeleteStatus = table.Column<byte>(nullable: false),
                    CollectTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonthTarget", x => x.TargetID);
                });

            migrationBuilder.CreateTable(
                name: "WeekTarget",
                columns: table => new
                {
                    TargetID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WeekID = table.Column<int>(nullable: false),
                    UserID = table.Column<int>(nullable: false),
                    Describe = table.Column<string>(maxLength: 140, nullable: true),
                    CompletionState = table.Column<byte>(nullable: false),
                    DeleteState = table.Column<byte>(nullable: false),
                    CollectTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeekTarget", x => x.TargetID);
                });

            migrationBuilder.CreateTable(
                name: "YearTarget",
                columns: table => new
                {
                    TargetID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    YearID = table.Column<int>(nullable: false),
                    UserID = table.Column<int>(nullable: false),
                    Describe = table.Column<string>(maxLength: 140, nullable: true),
                    CompletionState = table.Column<byte>(nullable: false),
                    DeleteState = table.Column<byte>(nullable: false),
                    CollectTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YearTarget", x => x.TargetID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LifelongTarget");

            migrationBuilder.DropTable(
                name: "MonthTarget");

            migrationBuilder.DropTable(
                name: "WeekTarget");

            migrationBuilder.DropTable(
                name: "YearTarget");

            migrationBuilder.DropColumn(
                name: "AvatarUrl",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastLoginIP",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastLoginTime",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Nickname",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "OpenID",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Province",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CompletionState",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "DeleteState",
                table: "Jobs");

            migrationBuilder.AlterColumn<string>(
                name: "VipLevel",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "UnionID",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 32,
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "RegIP",
                table: "Users",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 32,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Mobile",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 32,
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "LastLogonIP",
                table: "Users",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLogonTime",
                table: "Users",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "Describe",
                table: "Targets",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 140,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Describe",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AddColumn<byte>(
                name: "CompletionStatus",
                table: "Jobs",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<byte>(
                name: "DeleteStatus",
                table: "Jobs",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);
        }
    }
}
