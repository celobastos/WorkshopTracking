namespace WorkshopTracking.DTOs
{
    public class UpdateAtaDto
    {
        public int WorkshopId { get; set; }
        public List<int> ColaboradorIds { get; set; } = new List<int>();
    }
}
