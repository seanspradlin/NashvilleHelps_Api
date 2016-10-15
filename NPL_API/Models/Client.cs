using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace NPL_API.Models
{
    public class Client
    {
        [Key]
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string EmailAddress { get; set; }

        public string Address { get; set; }

        public string PhoneNumber { get; set; }

        public string AssistingOrganization { get; set; }

        public List<Referral> Referrals { get; set; }
    }
}