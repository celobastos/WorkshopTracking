namespace WorkshopTracking.Models
{
    public class Colaborador
    {
        public int Id { get; set; }
        public string Nome { get; set; } = null!;
        public ICollection<Ata> Atas { get; set; } = new List<Ata>();
    }
}
