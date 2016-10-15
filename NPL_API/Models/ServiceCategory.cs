using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace NPL_API.Models
{
    public class ServiceCategory
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public virtual List<Service> Services { get; set; }
    }
}