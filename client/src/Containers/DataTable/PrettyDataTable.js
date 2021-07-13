import React from "react";
// javascipt plugin for creating charts
import Chart from "chart.js";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import StickyHeadTable from "../../components/Tables/table.js";
import Box from "@material-ui/core/Box";

import {
    chartOptions,
    parseOptions,
} from "variables/charts.js";
import componentStyles from "../../assets/theme/views/dashboard"

import Typography from "@material-ui/core/Typography";
// @material-ui/icons components

if (window.Chart) {
    parseOptions(Chart, chartOptions());
}
const PrettyDataTable = ({ tableData }) => {
    console.log('tableData = ', tableData)

    const useStyles = makeStyles(componentStyles);
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Card
            classes={{
                root: classes.cardRoot,
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
                                variant="h3"
                                marginBottom="0!important"
                            >
                                Suspicious Loans
                            </Box>
                        </Grid>

                    </Grid>
                }
                classes={{ root: classes.cardHeaderRoot }}
            ></CardHeader>
            {tableData && tableData.length > 0 &&
                <StickyHeadTable tableData={tableData} />}
        </Card>
    );
}
export default PrettyDataTable;