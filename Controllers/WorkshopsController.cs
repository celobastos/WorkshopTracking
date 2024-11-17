using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkshopTracking.Data;
using WorkshopTracking.Models;

namespace WorkshopTracking.Controllers
{
    [Route("api/workshops")]
    [ApiController]
    [Authorize] 
    public class WorkshopsController : ControllerBase
    {
        private readonly WorkshopContext _context;

        public WorkshopsController(WorkshopContext context)
        {
            _context = context;
        }

        // Get all workshops
        [HttpGet]
        public IActionResult GetWorkshops()
        {
            var workshops = _context.Workshops.ToList();
            return Ok(workshops);
        }

        // Get workshop by ID
        [HttpGet("{id}")]
        public IActionResult GetWorkshopById(int id)
        {
            var workshop = _context.Workshops.Find(id);
            if (workshop == null)
                return NotFound();

            return Ok(workshop);
        }

        // Add workshop
        [HttpPost]
        public IActionResult AddWorkshop(Workshop workshop)
        {
            _context.Workshops.Add(workshop);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetWorkshopById), new { id = workshop.Id }, workshop);
        }

        // Update workshop
        [HttpPut("{id}")]
        public IActionResult UpdateWorkshop(int id, Workshop workshop)
        {
            var existingWorkshop = _context.Workshops.Find(id);
            if (existingWorkshop == null)
                return NotFound();

            existingWorkshop.Nome = workshop.Nome;
            existingWorkshop.DataRealizacao = workshop.DataRealizacao;
            existingWorkshop.Descricao = workshop.Descricao;

            _context.SaveChanges();
            return NoContent();
        }

        // Delete workshop
        [HttpDelete("{id}")]
        public IActionResult DeleteWorkshop(int id)
        {
            var workshop = _context.Workshops.Find(id);
            if (workshop == null)
                return NotFound();

            _context.Workshops.Remove(workshop);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
