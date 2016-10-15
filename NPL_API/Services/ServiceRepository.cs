using NPL_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NPL_API.Services
{
    public class ServiceRepository
    {
        private NPLContext Context { get; set; }

        public ServiceRepository(NPLContext context)
        {
            Context = context;
        }
        public ServiceRepository()
        {
            Context = new NPLContext();
        }

        public List<Service> GetAllServices()
        {
            return Context.Services.ToList();
        }

        public List<ServiceCategory> GetAllServiceCategories()
        {
            return Context.ServiceCategories.ToList();
        }

        public List<Service> GetServicesByServiceCategoryId(int id)
        {
            return Context.Services.Where(x => x.Category.Id == id).ToList();
        }

        public void AddService(Service service)
        {
            Context.Services.Add(service);
            Context.SaveChanges();
        }

        public void AddServiceCategory(ServiceCategory serviceCategory) 
        {
            Context.ServiceCategories.Add(serviceCategory);
        }

        public void UpdateService(Service service)
        {
            var currentService = Context.Services.FirstOrDefault(x => x.Id == service.Id);
            if (currentService != null)
            {
                currentService.Name = service.Name;
                currentService.Category = service.Category;
                Context.SaveChanges();
            }
        }

        public void UpdateServiceCategory(ServiceCategory serviceCategory)
        {
            var currentServiceCategory = Context.ServiceCategories.FirstOrDefault(x => x.Id == serviceCategory.Id);
            if (currentServiceCategory != null)
            {
                currentServiceCategory.Name = serviceCategory.Name;
                Context.SaveChanges();
            }
        }

        public void DeleteService(int id)
        {
            var currentService = Context.Services.FirstOrDefault(x => x.Id == id);
            if (currentService != null)
            {
                Context.Services.Remove(currentService);
                Context.SaveChanges();
            }            
        }

        public void DeleteServiceCategory(int id)
        {
            var currentServiceCategory = Context.ServiceCategories.FirstOrDefault(x => x.Id == id);
            if (currentServiceCategory != null)
            {
                Context.ServiceCategories.Remove(currentServiceCategory);
                Context.SaveChanges();
            }
        }

    }
}