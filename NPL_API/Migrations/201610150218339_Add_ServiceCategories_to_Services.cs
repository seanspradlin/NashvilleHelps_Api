namespace NPL_API.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Add_ServiceCategories_to_Services : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.Services", name: "ServiceCategory_Id", newName: "Category_Id");
            RenameIndex(table: "dbo.Services", name: "IX_ServiceCategory_Id", newName: "IX_Category_Id");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.Services", name: "IX_Category_Id", newName: "IX_ServiceCategory_Id");
            RenameColumn(table: "dbo.Services", name: "Category_Id", newName: "ServiceCategory_Id");
        }
    }
}
