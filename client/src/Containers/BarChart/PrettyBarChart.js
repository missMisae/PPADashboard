import React from "react";
// javascipt plugin for creating charts
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import BarChart from "../../components/Charts/barChart"
import Box from "@material-ui/core/Box";


import componentStyles from "../../assets/theme/views/dashboard"


// @material-ui/icons components


const PrettyBarChart = (props) => {
    console.log("props = ", props)

    const useStyles = makeStyles(componentStyles);
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Card classes={{ root: classes.cardRoot }}>
            <CardHeader
                title={
                    <Box component="span" color={theme.palette.gray[600]}>
                        Loans Given
                    </Box>
                }
                subheader="Total number of loans given"
                classes={{ root: classes.cardHeaderRoot }}
                titleTypographyProps={{
                    component: Box,
                    variant: "h6",
                    letterSpacing: ".0625rem",
                    marginBottom: ".25rem!important",
                    classes: {
                        root: classes.textUppercase,
                    },
                }}
                subheaderTypographyProps={{
                    component: Box,
                    variant: "h2",
                    marginBottom: "0!important",
                    color: "initial",
                }}
            ></CardHeader>
            <CardContent>
                <Box position="relative" height="350px">
                    {props.barChartData.datasets && props.barChartData.datasets.length > 0 &&
                        <BarChart chartData={props.barChartData} />
                    }
                </Box>
            </CardContent>
        </Card>
    );
}
export default PrettyBarChart;