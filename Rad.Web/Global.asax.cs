using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using ThirdCorner.Base.Models;

namespace Rad.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            log4net.GlobalContext.Properties["ApplicationName"] = ConfigurationManager.AppSettings["log4netApplicationName"];
            log4net.ThreadContext.Properties["ApplicationName"] = ConfigurationManager.AppSettings["log4netApplicationName"];
            log4net.LogicalThreadContext.Properties["ApplicationName"] = ConfigurationManager.AppSettings["log4netApplicationName"];
            log4net.Config.BasicConfigurator.Configure();

            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            // mostly for windows auth
            if ((Request.LogonUserIdentity == null || !Request.IsAuthenticated) && string.IsNullOrEmpty(ConfigurationManager.AppSettings["impersonateUser"]))
                return;
            var userName = !string.IsNullOrEmpty(ConfigurationManager.AppSettings["impersonateUser"]) ? ConfigurationManager.AppSettings["impersonateUser"] : Request.LogonUserIdentity.Name;

            // go get the user record from a service, AD, database, etc.
            var user = new ThirdCorner.Base.Models.User
            {
                UserId = 1,
                UserName = userName,
                FullName = "Sean Goodpasture",
                IsAdmin = true
            };
            // put it in the session
            HttpContext.Current.Session[LoggedInUser.SESSION_KEY] = user;


        }
    }
}
