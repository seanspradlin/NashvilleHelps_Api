using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace NPL_API.Models
{
    public class Referral
    {
        [Key]
        public int Id { get; set; }

        [DefaultValue(false)]
        public bool IsComplete { get; set; }
        public DateTime DateRequested { get; set; }

        public virtual Service ServiceRequested { get; set; }
        public virtual AgencyUser AgencyReferred { get; set; }
        public virtual Client Client { get; set; }
    }
}