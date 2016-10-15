using NPL_API.Models;
using NPL_API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace NPL_API.Controllers
{
    public class ServiceController : ApiController
    {
        private ServiceRepository Repository { get; set; }

        [HttpGet]
        [Route("Services")]
        public List<Service> GetAllServices()
        {
            return Repository.GetAllServices();
        }

        [HttpGet]
        [Route("Services/Category/{id}")]
        public List<Service> GetServicesByCategoryId(int id)
        {
            return Repository.GetServicesByServiceCategoryId(id);
        }

        [HttpPost]
        [Route("Services")]
        public void AddService(Service service)
        {
        }
    }
}
