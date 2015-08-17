using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ThirdCorner.Base.Models;
using System.Web;
using System.Web.Mvc;
using Rad.Web.Models;
using ThirdCorner.Base.Controllers;

namespace Rad.Web.Controllers
{
    public class HomeController : BaseController<RADDataContext>
    {
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult DoSearch(int pageIndex, int pageCount, string sortColumn, string sortDirection, FormCollection form)
        {
            var items = GetItems(form, sortColumn, sortDirection);

            var count = items.Count();
            pageCount = count / 20 + (count % 20 > 0 ? 1 : 0);
            var pagedItems = items.Skip(pageIndex * 20).Take(20);

            return PartialView(new ItemViewModel
            {
                Items = pagedItems,
                PageCount = pageCount,
                PageIndex = pageIndex,
                SortColumn = sortColumn,
                SortDirection = sortDirection
            });
        }
        private IEnumerable<Item> GetItems(FormCollection form, string sortColumn, string sortDirection)
        {
            var users = DataContext.Items.AsQueryable();

            if (!string.IsNullOrEmpty(form["name"]))
                users = users.Where(u => u.Name.Contains(form["name"]));

            return users.OrderBy(sortColumn + " " + sortDirection);
        }

        public ActionResult Export(string sortColumn, string sortDirection, FormCollection form)
        {
            var s = GetItems(form, sortColumn, sortDirection);
            var sb = new StringBuilder();
            sb.AppendLine("Name,Manufacturer,Serial Number,Date Acquired");

            foreach (var t in s)
                sb.AppendLine(
                    GetCSVLine(new[]
                    {
                        t.Name,
                        t.Manufacturer,
                        t.SerialNumber,
                        t.DateAcquired.ToString("MM/dd/yyyy")
                    }));
            return File(new UTF8Encoding().GetBytes(sb.ToString()), "text/csv", "Items.csv");
        }

        public ActionResult Edit(int id)
        {
            SubmitChanges = false;
            Item item;
            if (id == 0)
            {
                item = new Item{ Id = 0, DateAcquired = DateTime.Now};
            }
            else
            {
                item = DataContext.Items.Single(u => u.Id == id);
            }
            return View(new ItemViewModel { Item = item});
        }

        public ActionResult Save(int id, FormCollection form)
        {
            Item item;
            if (id == 0)
            {
                item = new Item { Id = 0 };
                DataContext.Items.InsertOnSubmit(item);
            }
            else
            {
                item = DataContext.Items.Single(u => u.Id == id);
            }
            item.Name= form["name"];
            item.Manufacturer= form["manufacturer"];
            item.SerialNumber= form["serialNumber"];
            item.DateAcquired= DateTime.Parse(form["dateAcquired"]);
            item.Price= decimal.Parse( form["price"]);
            
            // not required
            // DataContext.SubmitChanges();
            return RedirectToAction("Index");
        }
    }
}