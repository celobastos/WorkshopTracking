using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkshopTracking.Data;
using WorkshopTracking.DTOs;
using WorkshopTracking.Models;

namespace WorkshopTracking.Controllers
{
    [Route("api/atas")]
    [ApiController]
    [Authorize]
    public class AtasController : ControllerBase
    {
        private readonly WorkshopContext _context;

        public AtasController(WorkshopContext context)
        {
            _context = context;
        }

        // Get all Atas
        [HttpGet]
        public IActionResult GetAtas()
        {
            var atas = _context.AtasPresenca
                .Include(a => a.Workshop)
                .Include(a => a.Colaboradores)
                .Select(a => new AtaDto
                {
                    Id = a.Id,
                    WorkshopId = a.WorkshopId,
                    WorkshopName = a.Workshop.Nome,
                    DataRegistro = a.DataRegistro,
                    Colaboradores = a.Colaboradores.Select(c => new ColaboradorDto
                    {
                        Id = c.Id,
                        Nome = c.Nome
                    }).ToList()
                })
                .ToList();

            return Ok(atas);
        }

        // Get Ata by ID
    [HttpGet("by-workshop/{workshopId}")]
    public IActionResult GetAtaById(int workshopId)
    {
        var atas = _context.AtasPresenca
            .Include(a => a.Workshop)
            .Include(a => a.Colaboradores)
            .Where(a => a.WorkshopId == workshopId)
            .Select(a => new AtaDto
            {
                Id = a.Id,
                WorkshopId = a.WorkshopId,
                WorkshopName = a.Workshop.Nome,
                DataRegistro = a.DataRegistro,
                Colaboradores = a.Colaboradores.Select(c => new ColaboradorDto
                {
                    Id = c.Id,
                    Nome = c.Nome
                }).ToList()
            })
        .ToList();

    if (!atas.Any())
        return NotFound($"No Atas found for WorkshopId: {workshopId}");

    return Ok(atas);
}


        // Add a new Ata
        [HttpPost]
        public IActionResult AddAta([FromBody] AddAtaDto ataDto)
        {
            var workshopExists = _context.Workshops.Any(w => w.Id == ataDto.WorkshopId);
            if (!workshopExists)
                return BadRequest("Invalid WorkshopId.");

            var colaboradores = _context.Colaboradores
                .Where(c => ataDto.ColaboradorIds.Contains(c.Id))
                .ToList();

            if (colaboradores.Count != ataDto.ColaboradorIds.Count)
                return BadRequest("Some ColaboradorIds are invalid.");

            var ata = new Ata
            {
                WorkshopId = ataDto.WorkshopId,
                DataRegistro = DateTime.UtcNow,
                Colaboradores = colaboradores
            };

            _context.AtasPresenca.Add(ata);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAtaById), new { id = ata.Id }, new AtaDto
            {
                Id = ata.Id,
                WorkshopId = ata.WorkshopId,
                WorkshopName = _context.Workshops.FirstOrDefault(w => w.Id == ata.WorkshopId)?.Nome ?? string.Empty,
                DataRegistro = ata.DataRegistro,
                Colaboradores = colaboradores.Select(c => new ColaboradorDto
                {
                    Id = c.Id,
                    Nome = c.Nome
                }).ToList()
            });
        }

        // Update an existing Ata
        [HttpPut("{id}")]
        public IActionResult UpdateAta(int id, [FromBody] UpdateAtaDto updateAtaDto)
        {
            var existingAta = _context.AtasPresenca
                .Include(a => a.Colaboradores)
                .FirstOrDefault(a => a.Id == id);

            if (existingAta == null)
                return NotFound();

            existingAta.WorkshopId = updateAtaDto.WorkshopId;

            var collaborators = _context.Colaboradores
                .Where(c => updateAtaDto.ColaboradorIds.Contains(c.Id))
                .ToList();

            if (collaborators.Count != updateAtaDto.ColaboradorIds.Count)
                return BadRequest("Some ColaboradorIds are invalid.");

            existingAta.Colaboradores.Clear();
            foreach (var collaborator in collaborators)
            {
                existingAta.Colaboradores.Add(collaborator);
            }

            _context.SaveChanges();

            return NoContent();
        }

        // Delete an Ata
        [HttpDelete("{id}")]
        public IActionResult DeleteAta(int id)
        {
            var ata = _context.AtasPresenca.Find(id);
            if (ata == null)
                return NotFound();

            _context.AtasPresenca.Remove(ata);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
