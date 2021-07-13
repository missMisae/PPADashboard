import {
    chartOptions,
    parseOptions,
    chartExample1,
} from "../../variables/charts.js";
import React from "react";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line } from "react-chartjs-2";


const LineChart = (props) => {
    if (window.Chart) {
        parseOptions(Chart, chartOptions());
    }
    return (
        <Line
            data={props.chartData}
            options={chartExample1.options}
            getDatasetAtEvent={(e) => console.log(e)}
        />
    );
}
export default LineChart;