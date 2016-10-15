using Microsoft.AspNet.Identity.EntityFramework;
using NPL_API.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace NPL_API
{
    public class NPLContext : IdentityDbContext<AgencyUser>
    {
        public NPLContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public static NPLContext Create()
        {
            return new NPLContext();
        }

        public virtual DbSet<Client> Clients { get; set; }
        public virtual DbSet<Referral> Referrals { get; set; }
        public virtual DbSet<ServiceCategory> ServiceCategories { get; set; }
        public virtual DbSet<Service> Services { get; set; }
    }
}