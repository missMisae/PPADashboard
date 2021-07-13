import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import LocationOn from "@material-ui/icons/LocationOn";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import InsertChartOutlined from "@material-ui/icons/InsertChartOutlined";
import ErrorIcon from '@material-ui/icons/Error';

// core components
import CardStats from "components/Cards/CardStats.js";

import componentStyles from "assets/theme/components/header.js";

const useStyles = makeStyles(componentStyles);

const Header = ({ data, frauds }) => {
  const classes = useStyles();
  const theme = useTheme();
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });


  return (
    <>
      <div className={classes.header}>
        <Container
          maxWidth={false}
          component={Box}
          classes={{ root: classes.containerRoot }}
        >
          <div>
            <Grid container>
              <Grid item xl={3} lg={6} xs={12}>
                <CardStats
                  subtitle="State"
                  title="Alaska"
                  icon={LocationOn}
                  color="bgInfo"
                />
              </Grid>
              <Grid item xl={3} lg={6} xs={12}>
                <CardStats
                  subtitle="Number of Loans Given"
                  title={data.loansGiven}
                  icon={InsertChartOutlined}
                  color="bgError"

                />
              </Grid>
              <Grid item xl={3} lg={6} xs={12}>
                <CardStats
                  subtitle="Total Amount Dispursed"
                  title={formatter.format(data.totalDispersed)}
                  icon={MonetizationOnIcon}
                  color="bgWarning"

                />
              </Grid>
              <Grid item xl={3} lg={6} xs={12}>
                <CardStats
                  subtitle="Number of Suspicious Loans"
                  title={frauds}
                  icon={ErrorIcon}
                  color="bgWarningLight"
                />
              </Grid>

            </Grid>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
