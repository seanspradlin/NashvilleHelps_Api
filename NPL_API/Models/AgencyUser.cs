using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace NPL_API.Models
{
    public class AgencyUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<AgencyUser> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
        
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }

        public string AgencyName { get; set; }
        public string AgencyAddress { get; set; }
        public string AgencyPhoneNumber { get; set; }
        public string AgencyEmail { get; set; }

        public bool IsActive { get; set; }
        public bool IsAdministrator { get; set; }

        public virtual List<Service> ServicesOffered { get; set; }
    }
}