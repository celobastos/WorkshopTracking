namespace WorkshopTracking.DTOs
{
    public class AddAtaDto
    {
        public int WorkshopId { get; set; }
        public List<int> ColaboradorIds { get; set; } = new List<int>();
    }
}
