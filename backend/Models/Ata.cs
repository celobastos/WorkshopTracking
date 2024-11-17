namespace WorkshopTracking.Models
{
    public class Ata
    {
        public int Id { get; set; }
        public int ColaboradorId { get; set; }
        public int WorkshopId { get; set; }
        public DateTime DataRegistro { get; set; }

        public Colaborador Colaborador { get; set; } = null!;
        public Workshop Workshop { get; set; } = null!;
    }
}
