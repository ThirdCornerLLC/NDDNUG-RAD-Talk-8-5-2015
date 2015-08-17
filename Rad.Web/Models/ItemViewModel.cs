using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ThirdCorner.Base.Models;

namespace Rad.Web.Models
{
    public class ItemViewModel : PagingSortingViewModel
    {
        public IEnumerable<Item> Items;
        public Item Item;
    }
}