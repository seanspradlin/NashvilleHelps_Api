namespace NPL_API.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Service_ManytoMany_AgencyUser : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Services", "AgencyUser_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Services", new[] { "AgencyUser_Id" });
            CreateTable(
                "dbo.ServiceAgencyUsers",
                c => new
                    {
                        Service_Id = c.Int(nullable: false),
                        AgencyUser_Id = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.Service_Id, t.AgencyUser_Id })
                .ForeignKey("dbo.Services", t => t.Service_Id, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.AgencyUser_Id, cascadeDelete: true)
                .Index(t => t.Service_Id)
                .Index(t => t.AgencyUser_Id);
            
            DropColumn("dbo.Services", "AgencyUser_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Services", "AgencyUser_Id", c => c.String(maxLength: 128));
            DropForeignKey("dbo.ServiceAgencyUsers", "AgencyUser_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.ServiceAgencyUsers", "Service_Id", "dbo.Services");
            DropIndex("dbo.ServiceAgencyUsers", new[] { "AgencyUser_Id" });
            DropIndex("dbo.ServiceAgencyUsers", new[] { "Service_Id" });
            DropTable("dbo.ServiceAgencyUsers");
            CreateIndex("dbo.Services", "AgencyUser_Id");
            AddForeignKey("dbo.Services", "AgencyUser_Id", "dbo.AspNetUsers", "Id");
        }
    }
}
