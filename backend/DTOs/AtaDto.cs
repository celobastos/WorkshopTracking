namespace WorkshopTracking.DTOs
{
    public class AtaDto
    {
        public int Id { get; set; }
        public int WorkshopId { get; set; }
        public string WorkshopName { get; set; } = string.Empty;
        public DateTime DataRegistro { get; set; }
        public List<ColaboradorDto> Colaboradores { get; set; } = new List<ColaboradorDto>();
    }
}
