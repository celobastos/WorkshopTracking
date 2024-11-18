using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkshopTracking.Migrations
{
    /// <inheritdoc />
    public partial class AddAtaColaboradoresRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_atas_presenca_colaboradores_ColaboradorId",
                table: "atas_presenca");

            migrationBuilder.DropIndex(
                name: "IX_atas_presenca_ColaboradorId",
                table: "atas_presenca");

            migrationBuilder.DropColumn(
                name: "ColaboradorId",
                table: "atas_presenca");

            migrationBuilder.CreateTable(
                name: "ata_colaboradores",
                columns: table => new
                {
                    AtasId = table.Column<int>(type: "int", nullable: false),
                    ColaboradoresId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ata_colaboradores", x => new { x.AtasId, x.ColaboradoresId });
                    table.ForeignKey(
                        name: "FK_ata_colaboradores_atas_presenca_AtasId",
                        column: x => x.AtasId,
                        principalTable: "atas_presenca",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ata_colaboradores_colaboradores_ColaboradoresId",
                        column: x => x.ColaboradoresId,
                        principalTable: "colaboradores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ata_colaboradores_ColaboradoresId",
                table: "ata_colaboradores",
                column: "ColaboradoresId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ata_colaboradores");

            migrationBuilder.AddColumn<int>(
                name: "ColaboradorId",
                table: "atas_presenca",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_atas_presenca_ColaboradorId",
                table: "atas_presenca",
                column: "ColaboradorId");

            migrationBuilder.AddForeignKey(
                name: "FK_atas_presenca_colaboradores_ColaboradorId",
                table: "atas_presenca",
                column: "ColaboradorId",
                principalTable: "colaboradores",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
