using Microsoft.EntityFrameworkCore;
using WorkshopTracking.Models;

namespace WorkshopTracking.Data
{
    public class WorkshopContext : DbContext
    {
        public WorkshopContext(DbContextOptions<WorkshopContext> options) : base(options) { }

        public DbSet<Workshop> Workshops { get; set; } = default!;
        public DbSet<Colaborador> Colaboradores { get; set; } = default!;
        public DbSet<Ata> AtasPresenca { get; set; } = default!;
        public DbSet<User> Users { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Workshop>().ToTable("workshops");
            modelBuilder.Entity<Colaborador>().ToTable("colaboradores");
            modelBuilder.Entity<Ata>().ToTable("atas_presenca");

            modelBuilder.Entity<Ata>()
                .HasMany(a => a.Colaboradores)
                .WithMany(c => c.Atas)
                .UsingEntity(j => j.ToTable("ata_colaboradores"));

            modelBuilder.Entity<User>().ToTable("users");
        }
    }
}
