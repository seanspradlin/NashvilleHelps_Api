using NPL_API.ApiModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace NPL_API.Controllers
{
    public class ClientController : ApiController
    {
        /// <summary>
        /// Add client for referrals
        /// </summary>
        /// <param name="form"></param>
        [HttpPost]
        [Route("/client")]
        public void AddClient(ClientReferralForm form)
        {

        }
        
    }
}
