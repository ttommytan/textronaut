import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import { Chart as ChartJS } from 'chart.js/auto';

function LineChart({ graphData, trigger, setTrigger }) {
    const [graphNum, setGraphNum] = useState(0);
    const [multiple, setMultiple] = useState(false);
    const [columns, setColumns] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [chartLabels, setChartLabels] = useState("")


    useEffect(() => {
        if (Array.isArray(graphData)) {
            setMultiple(true);
            setColumns(graphData[graphNum].columns);
            setChartData(graphData[graphNum].chartData);
            setChartLabels(graphData[graphNum].labels)
        } else {
            setColumns(graphData.columns);
            setChartData(graphData.chartData);
            setChartLabels(graphData.labels)
        }
    }, [graphData, graphNum]);

    const labels = chartData.map((data) => data.index);

    const datasets = columns.map((column, index) => ({
        label: column,
        data: chartData.map((data) => data[column])
    }));

    const data = {
        labels: labels,
        datasets: datasets
    };

    const handleGraphChange = () => {
      setTrigger(!trigger)
      if (multiple) {
          setGraphNum((prevGraphNum) => (prevGraphNum === graphData.length - 1 ? 0 : prevGraphNum + 1));
      }
    };



    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'category', // Treat 'x' as categorical
                title: {
                    display: false,
                    text: chartLabels['x_axis'],
                },
            },
            y: {
                title: {
                    display: true,
                    text: chartLabels['y_axis'],
                },
            },
        },
        plugins: {
            title: {
              display: false,
              text: chartLabels['title'],
            },
            tooltip: true,
            legend: {
                display: true,
                position: 'top',
            },
        }
    };

    return (
        <div className="line-chart-container">
            <Line className="line-chart"data={data} options={options} />
            <button className="line-change line-change-other" style={{ display: multiple ? 'block' : 'none' }} onClick={handleGraphChange}>change</button>
        </div>
    );
}

export default LineChart;
