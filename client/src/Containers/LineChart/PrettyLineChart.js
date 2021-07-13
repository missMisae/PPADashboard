import React from "react";
// javascipt plugin for creating charts
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LineChart from "../../components/Charts/lineChart"
import Box from "@material-ui/core/Box";


import componentStyles from "../../assets/theme/views/dashboard"

import Typography from "@material-ui/core/Typography";
// @material-ui/icons components


const PrettyLineChart = (props) => {

    const useStyles = makeStyles(componentStyles);
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Card
            classes={{
                root: classes.cardRoot + " " + classes.cardRootBgGradient,
            }}
        >
            <CardHeader
                subheader={
                    <Grid
                        container
                        component={Box}
                        alignItems="center"
                        justifyContent="space-between"
                    >

                        <Grid item xs="auto">
                            <Box
                                component={Typography}
                                variant="h6"
                                letterSpacing=".0625rem"
                                marginBottom=".25rem!important"
                                className={classes.textUppercase}
                            >
                                <Box component="span" color={theme.palette.gray[400]}>
                                    Overview
                                </Box>
                            </Box>
                            <Box
                                component={Typography}
                                variant="h2"
                                marginBottom="0!important"
                            >
                                <Box component="span" color={theme.palette.white.main}>
                                    Loan Amount Given (USD)
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>
                }
                classes={{ root: classes.cardHeaderRoot }}
            ></CardHeader>
            <CardContent>
                <Box position="relative" height="350px">
                    {props.lineChartData.datasets && props.lineChartData.datasets.length > 0 &&
                        <LineChart chartData={props.lineChartData} />}
                </Box>
            </CardContent>
        </Card>
    );
}
export default PrettyLineChart;