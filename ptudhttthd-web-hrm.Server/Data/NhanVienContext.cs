using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Infrastructure.Internal;
using ptudhttthd_web_hrm.Server.Models;

public class NhanVienContext : DbContext
{
    public NhanVienContext(DbContextOptions<NhanVienContext> options) : base(options) { }

    public DbSet<NhanVien> NhanViens { get; set; }
    public DbSet<BangCap> BangCaps { get; set; }
    public DbSet<TTNganHang> TTNganHangs { get; set; }
    public DbSet<KinhNghiemLamViec> KinhNghiemLamViecs { get; set; }
    public DbSet<YeuCauNhanVien> YeuCauNhanViens { get; set; }
    public DbSet<LoaiYeuCau> LoaiYeuCaus {  get; set; }
    public DbSet<RequestFileUpload> RequestFileUploads { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<NhanVien>()
            .HasOne(e => e.NhanVienQuanLy)
            .WithMany(e => e.DSNhanVienDuocQuanLy)
            .HasForeignKey(e => e.QuanLyID)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TTNganHang>()
            .HasKey(e => new { e.STKNganHang, e.TenNganHang, e.ChiNhanh });

        modelBuilder.Entity<TTNganHang>()
            .HasOne(e => e.NhanVienSoHuu)
            .WithMany(e => e.DSTaiKhoanNganHang)
            .HasForeignKey(e => e.NhanVienID)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BangCap>()
            .HasKey(e => new { e.MaBang, e.TenBang });

        modelBuilder.Entity<BangCap>()
            .HasOne(e => e.NhanVienSoHuu)
            .WithMany(e => e.DSBangCap)
            .HasForeignKey(e => e.NhanVienID)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<KinhNghiemLamViec>()
            .HasOne(e => e.NhanVienSoHuu)
            .WithMany(e => e.DSKinhNghiemLamViec)
            .HasForeignKey(e => e.NhanVienID)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<YeuCauNhanVien>()
            .HasOne(e => e.NhanVien)
            .WithMany()
            .HasForeignKey(e => e.NhanVienID)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<LoaiYeuCau>();

        modelBuilder.Entity<YeuCauNhanVien>()
            .HasOne(e => e.QuanLy)
            .WithMany()
            .HasForeignKey(e => e.NhanVienQuanly)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<YeuCauNhanVien>()
            .HasOne(e =>e.IDYC )
            .WithMany()
            .HasForeignKey(e => e.MaLoaiYC)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<YeuCauNhanVien>()
            .HasOne(e => e.NhanVien)
            .WithMany()
            .HasForeignKey(e => e.NhanVienID)
            .OnDelete(DeleteBehavior.Restrict);
        base.OnModelCreating(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(optionsBuilder.Options.FindExtension<SqlServerOptionsExtension>().ConnectionString,
            sqlOptions => sqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
    }
}
