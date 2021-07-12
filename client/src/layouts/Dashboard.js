import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

// core components
import DashboardFooter from "components/Footers/DashboardFooter";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

import componentStyles from "assets/theme/layouts/dashboard.js";

const useStyles = makeStyles(componentStyles);

const Dashboard = () => {
  const classes = useStyles();
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    // mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/dashboard") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };


  return (
    <>
      <>
        <Sidebar
          routes={routes}
          logo={{
            innerLink: "/dashboard/index",
            imgSrc: require("../assets/img/brand/transunion.png").default,
            imgAlt: "...",
          }}
        />
        <Box position="relative" className={classes.mainContent}>
          <Switch>
            {getRoutes(routes)}
            <Redirect from="*" to="/dashboard/index" />
          </Switch>
          <Container
            maxWidth={false}
            component={Box}
            classes={{ root: classes.containerRoot }}
          >
            <DashboardFooter />
          </Container>
        </Box>
      </>
    </>
  );
};

export default Dashboard;
