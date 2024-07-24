import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import { Chart as ChartJS } from 'chart.js/auto';

function LineChartSlider({ graphData }) {
    const [graphIndex, setGraphIndex] = useState(0);
    const [multiple, setMultiple] = useState(false);
    const [columns, setColumns] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (Array.isArray(graphData)) {
            setMultiple(true);
            setColumns(graphData[graphIndex].columns);
            setChartData(graphData[graphIndex].chartData);
        } else {
            setColumns(graphData.columns);
            setChartData(graphData.chartData);
        }
    }, [graphData, graphIndex]);

    const labels = chartData.map((data) => data.index);

    const datasets = columns.map((column, index) => ({
        label: column,
        data: chartData.map((data) => data[column])
    }));

    const data = {
        labels: labels,
        datasets: datasets
    };

    const handleSliderChange = (event) => {
        setGraphIndex(Number(event.target.value));
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Weekday',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Hour of the Day',
                },
            },
        },
        plugins: {
            title: {
              display: true,
              text: 'Your Chart Title Here',
            },
            tooltip: true,
            legend: {
                display: true,
                position: 'top',
            },
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow relative">
                <Line data={data} options={options} />
            </div>
            {multiple && (
                <div className="mt-4">
                    <input
                        type="range"
                        min="0"
                        max={graphData.length - 1}
                        value={graphIndex}
                        onChange={handleSliderChange}
                        className="w-full"
                    />
                    <div className="text-center mt-2">
                        Graph {graphIndex + 1} of {graphData.length}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LineChartSlider;