using Microsoft.EntityFrameworkCore;
using SIProjectSet1.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.Infrastructure
{
    public class SIProjectSet1Context: DbContext
    {
        public SIProjectSet1Context(DbContextOptions<SIProjectSet1Context> options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        public DbSet<UserRole> UserRoles { get; set; }

    }
}
