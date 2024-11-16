using Microsoft.AspNetCore.Mvc;
using WorkshopTracking.Data;
using WorkshopTracking.Models;

namespace WorkshopTracking.Controllers
{
    [Route("api/colaboradores")]
    [ApiController]
    public class ColaboradoresController : ControllerBase
    {
        private readonly WorkshopContext _context;

        public ColaboradoresController(WorkshopContext context)
        {
            _context = context;
        }

        // Get all colaboradores
        [HttpGet]
        public IActionResult GetColaboradores()
        {
            var colaboradores = _context.Colaboradores.ToList();
            return Ok(colaboradores);
        }

        // Get by ID colaborador
        [HttpGet("{id}")]
        public IActionResult GetColaboradorById(int id)
        {
            var colaborador = _context.Colaboradores.Find(id);
            if (colaborador == null)
                return NotFound();

            return Ok(colaborador);
        }

        // Add colaborador
        [HttpPost]
        public IActionResult AddColaborador(Colaborador colaborador)
        {
            _context.Colaboradores.Add(colaborador);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetColaboradorById), new { id = colaborador.Id }, colaborador);
        }

        // Update colaborador
        [HttpPut("{id}")]
        public IActionResult UpdateColaborador(int id, Colaborador colaborador)
        {
            var existingColaborador = _context.Colaboradores.Find(id);
            if (existingColaborador == null)
                return NotFound();

            existingColaborador.Nome = colaborador.Nome;

            _context.SaveChanges();
            return NoContent();
        }

        // Delete colaborador
        [HttpDelete("{id}")]
        public IActionResult DeleteColaborador(int id)
        {
            var colaborador = _context.Colaboradores.Find(id);
            if (colaborador == null)
                return NotFound();

            _context.Colaboradores.Remove(colaborador);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
