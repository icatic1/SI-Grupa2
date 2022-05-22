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

        public DbSet<PassToken> PassTokens { get; set; }
        public DbSet<TFA> FTAs { get; set; }

        public DbSet<SecurityQuestion> SecurityQuestions { get; set; }


        public DbSet<UserPath> UserPaths { get; set; }

        public virtual DbSet<JsonConfiguration> JsonConfigurations { get; set; }
        public virtual DbSet<Licence> Licences { get; set; }
        public virtual DbSet<Device> Devices { get; set; }
        public DbSet<Entities.File> Files { get; set; }

    }
}
