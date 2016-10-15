namespace NPL_API.Migrations
{
    using Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<NPL_API.NPLContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(NPL_API.NPLContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            var ServiceCategory1 = new ServiceCategory { Name = "Education" };
            var ServiceCategory2 = new ServiceCategory { Name = "Employment" };
            var ServiceCategory3 = new ServiceCategory { Name = "Finances" };
            var ServiceCategory4 = new ServiceCategory { Name = "Health" };
            var ServiceCategory5 = new ServiceCategory { Name = "Housing and Food" };
            var ServiceCategory6 = new ServiceCategory { Name = "Youth and Children" };
            var ServiceCategory7 = new ServiceCategory { Name = "Additional Services" };

            var Service1 = new Service { Name = "ACT/SAT Preparation", Category = ServiceCategory1 };
            var Service2 = new Service { Name = "Citizenship Classes", Category = ServiceCategory1 };
            var Service3 = new Service { Name = "College Enrollment", Category = ServiceCategory1 };
            var Service4 = new Service { Name = "English Classes", Category = ServiceCategory1 };
            var Service5 = new Service { Name = "Free Basic Computer Skills Training", Category = ServiceCategory1 };
            var Service6 = new Service { Name = "GED and High School Equivalency Preparation", Category = ServiceCategory1 };
            var Service7 = new Service { Name = "Reading and Writing Tutoring", Category = ServiceCategory1 };

            var Service8 = new Service { Name = "Employment or Job Training", Category = ServiceCategory2 };
            var Service9 = new Service { Name = "Basic Computer Skills Training", Category = ServiceCategory2 };
            var Service10 = new Service { Name = "Resume Writing", Category = ServiceCategory2 };
            var Service11 = new Service { Name = "Vocational Rehabilitation", Category = ServiceCategory2 };

            var Service12 = new Service { Name = "Financial Education", Category = ServiceCategory3 };
            var Service13 = new Service { Name = "Financial Hardship Assistance", Category = ServiceCategory3 };
            var Service14 = new Service { Name = "Free one-on-one Financial Counseling", Category = ServiceCategory3 };

            var Service15 = new Service { Name = "Counseling or Mental Healthcare", Category = ServiceCategory4 };
            var Service16 = new Service { Name = "Dental Care for Adults and Children", Category = ServiceCategory4 };
            var Service17 = new Service { Name = "Drug and Alcohol Treatment", Category = ServiceCategory4 };
            var Service18 = new Service { Name = "Health Insurance Enrollment Assistance", Category = ServiceCategory4 };
            var Service19 = new Service { Name = "Medical Care for the Working Uninsured or Underinsured", Category = ServiceCategory4 };
            var Service20 = new Service { Name = "Nutritional Counseling", Category = ServiceCategory4 };
            var Service21 = new Service { Name = "Women’s Health Services", Category = ServiceCategory4 };

            var Service22 = new Service { Name = "Affordable Home Owndrship", Category = ServiceCategory5 };
            var Service23 = new Service { Name = "Currently Experiencing Homelessness", Category = ServiceCategory5 };
            var Service24 = new Service { Name = "Food Assistance", Category = ServiceCategory5 };
            var Service25 = new Service { Name = "SNAP Application Assistance", Category = ServiceCategory5 };

            var Service26 = new Service { Name = "Childcare", Category = ServiceCategory6 };
            var Service27 = new Service { Name = "Relative Caregivers", Category = ServiceCategory6 };
            var Service28 = new Service { Name = "Tutoring or Mentoring for Children", Category = ServiceCategory6 };
            var Service29 = new Service { Name = "Youth Services (Age 16-24)", Category = ServiceCategory6 };

            var Service30 = new Service { Name = "Domestic Violence Support", Category = ServiceCategory7 };
            var Service31 = new Service { Name = "Legal Aid", Category = ServiceCategory7 };
            var Service32 = new Service { Name = "Refugee Assistance", Category = ServiceCategory7 };
            var Service33 = new Service { Name = "Other", Category = ServiceCategory7 };

            context.ServiceCategories.AddOrUpdate(
                c => c.Name,
                ServiceCategory1,
                ServiceCategory2,
                ServiceCategory3,
                ServiceCategory4,
                ServiceCategory5,
                ServiceCategory6,
                ServiceCategory7
                );

            context.Services.AddOrUpdate(
                c => c.Name,
                Service1, Service2, Service3, Service4, Service5, Service6, Service7, Service8, Service9, Service10,
                Service11, Service12, Service13, Service14, Service15, Service16, Service17, Service18, Service19, Service20,
                Service21, Service22, Service23, Service24, Service25, Service26, Service27, Service28, Service29, Service30,
                Service31, Service32, Service33
                );
        }
    }
}
