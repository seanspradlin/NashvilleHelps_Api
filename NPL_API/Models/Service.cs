using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace NPL_API.Models
{
    public class Service
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public virtual ServiceCategory Category { get; set; }

        public virtual List<AgencyUser> Providers { get; set; }
    }
}