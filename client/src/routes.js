// core components
import Dashboard from "views/LandingPage/Dashboard.js";


import Tv from "@material-ui/icons/Tv";

var routes = [

  {
    path: "/index",
    name: "Dashboard",
    icon: Tv,
    iconColor: "Primary",
    component: Dashboard,
    layout: "/dashboard",
  }
];
export default routes;
