﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SIProjectSet1.Infrastructure;

#nullable disable

namespace SIProjectSet1.Migrations
{
    [DbContext(typeof(SIProjectSet1Context))]
    partial class SIProjectSet1ContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("SIProjectSet1.Entities.Device", b =>
                {
                    b.Property<string>("MacAddress")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("TerminalID")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("MacAddress");

                    b.ToTable("Devices");
                });

            modelBuilder.Entity("SIProjectSet1.Entities.DeviceToken", b =>
                {
                    b.Property<string>("MacAddress")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TokenExpiration")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("MacAddress");

                    b.ToTable("DeviceTokens");
                });

            modelBuilder.Entity("SIProjectSet1.Entities.File", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("ExpirationTime")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Path")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("Size")
                        .HasColumnType("float");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Files");
                });

            modelBuilder.Entity("SIProjectSet1.Entities.JsonConfiguration", b =>
                {
                    b.Property<string>("MacAddress")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Configuration")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("MacAddress");

                    b.ToTable("JsonConfigurations");
                });

            modelBuilder.Entity("SIProjectSet1.Entities.Licence", b =>
                {
                    b.Property<string>("MacAddress")
                        .HasColumnType("nvarchar(450)");

                    b.Property<bool>("DebugLog")
                        .HasColumnType("bit");

                    b.Property<bool>("Licenced")
                        .HasColumnType("bit");

                    b.Property<string>("TerminalID")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("MacAddress");

                    b.ToTable("Licences");
                });

            modelBuilder.Entity("SIProjectSet1.Entities.PassToken", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("varchar(250)");

                    b.Property<string>("ResetToken")
                        .IsRequired()
                        .HasColumnType("varchar(250)");

                    b.HasKey("Id");

                    b.ToTable("PassTokens");
                });

            modelBuilder.Entity("SIProjectSet1.Entities.Role", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("SIProjectSet1.Entities.SecurityQuestion", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<string>("Answer")
                        .IsRequired()
                        .HasColumnType("varchar(250)");

                    b.Property<string>("Question")
                        .IsRequired()
                        .HasColumnType("varchar(250)");

                    b.Property<long>("UserId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.ToTable("SecurityQuestions");
                });

            modelBuilder.Entity("SIProjectSet1.Entities.TFA", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<long>("UserId")
                        .HasColumnType("bigint");

                    b.Property<bool>("isActivated")
                        .HasColumnType("bit");

                    b.Property<string>("token")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("FTAs");
                });

            modelBuilder.Entity("SIProjectSet1.Entities.User", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<bool>("DeletedStatus")
                        .HasColumnType("bit");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("varchar(250)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<long>("RoleId")
                        .HasColumnType("bigint");

                    b.Property<string>("Surname")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("SIProjectSet1.Entities.UserPath", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<string>("MacAddress")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Path")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("UserPaths");
                });

            modelBuilder.Entity("SIProjectSet1.Entities.User", b =>
                {
                    b.HasOne("SIProjectSet1.Entities.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");
                });

            modelBuilder.Entity("SIProjectSet1.Entities.Role", b =>
                {
                    b.Navigation("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
