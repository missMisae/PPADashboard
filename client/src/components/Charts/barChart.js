import {
    chartOptions,
    parseOptions,
    chartExample2,
} from "../../variables/charts.js";
import React from "react";
// javascipt plugin for creating charts
import Chart from "chart.js";
import { Bar } from "react-chartjs-2";


const BarChart = (props) => {
    if (window.Chart) {
        parseOptions(Chart, chartOptions());
    }
    return (
        <Bar
            data={props.chartData}
            options={chartExample2.options}
        />
    );
}
export default BarChart;