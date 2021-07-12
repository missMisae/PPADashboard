import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
//import containers
import PrettyLineChart from "Containers/LineChart/PrettyLineChart"
import PrettyBarChart from "Containers/BarChart/PrettyBarChart"
import PrettyDataTable from "Containers/DataTable/PrettyDataTable"
// core components
import Header from "components/Headers/Header.js";
import componentStyles from "assets/theme/views/dashboard.js";

const useStyles = makeStyles(componentStyles);

function Dashboard() {
  const classes = useStyles();
  const theme = useTheme();

  const [lineChartData, setLineChartData] = React.useState(
    {
      labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Performance",
          data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
        },
      ],
    }
  )

  const [barChartData, setBarChartData] = React.useState(
    {
      labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Performance",
          data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
        },
      ],
    }
  )

  return (
    <>
      <Header />
      {/* Page content */}
      <Container
        maxWidth={false}
        component={Box}
        marginTop="-6rem"
        classes={{ root: classes.containerRoot }}
      >

        <Grid container>
          <Grid
            item
            xs={12}
            xl={8}
            component={Box}
            marginBottom="3rem!important"
            classes={{ root: classes.gridItemRoot }}
          >
            <PrettyLineChart lineChartData={lineChartData} />
          </Grid>
          <Grid item xs={12} xl={4}>
            <PrettyBarChart barChartData={barChartData} />
          </Grid>
        </Grid>
        <Grid container component={Box} marginTop="3rem">
          <Grid
            item
            xs={12}
            xl={8}
            component={Box}
            marginBottom="3rem!important"
            classes={{ root: classes.gridItemRoot }}
          >
            <PrettyDataTable />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}

export default Dashboard;
