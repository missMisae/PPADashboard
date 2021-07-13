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
import { getImmediateInsights, getInsightsOverTime, getSusLoans } from "services/services"

const useStyles = makeStyles(componentStyles);

function Dashboard() {
  const classes = useStyles();
  const theme = useTheme();

  const [lineChartData, setLineChartData] = React.useState({});
  const [tableData, setTableData] = React.useState({})
  const [barChartData, setBarChartData] = React.useState({});
  const [headerData, setHeaderData] = React.useState({})
  const [numFrauds, setNumFrauds] = React.useState(0)

  React.useEffect(() => {
    const getServices = async () => {
      let insights = await getInsightsOverTime()
      let immediate = await getImmediateInsights()
      let sus = await getSusLoans();
      setLineChartData(insights.approvedPerMonth)
      setBarChartData(insights.amountPerMonth)
      setHeaderData(immediate)
      setTableData(sus.locationData)
      setNumFrauds(sus.fraudCount)
    }
    getServices();


  }, [])



  return (
    <>
      <Header data={headerData} frauds={numFrauds} />
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
            <PrettyDataTable tableData={tableData} />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}

export default Dashboard;
