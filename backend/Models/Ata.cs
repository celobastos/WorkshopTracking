namespace WorkshopTracking.Models
{
    public class Ata
    {
        public int Id { get; set; }
        public int WorkshopId { get; set; }
        public DateTime DataRegistro { get; set; }

        public Workshop Workshop { get; set; } = null!;
        public ICollection<Colaborador> Colaboradores { get; set; } = new List<Colaborador>();
    }
}
