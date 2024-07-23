import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function AllCharts({ graphData }) {
  const [graphNum, setGraphNum] = useState(0);
  const [multiple, setMultiple] = useState(false);
  const [columns, setColumns] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [graphType, setGraphType] = useState('line');
  const graphTypes = ['line', 'bar'];

  useEffect(() => {
    if (Array.isArray(graphData)) {
      setMultiple(true);
      setColumns(graphData[graphNum].columns);
      setChartData(graphData[graphNum].chartData);
    } else {
      setColumns(graphData.columns);
      setChartData(graphData.chartData);
    }
  }, [graphData, graphNum]);

  const labels = chartData.map((data) => data.index);
  const datasets = columns.map((column) => ({
    label: column,
    data: chartData.map((data) => data[column])
  }));

  const data = {
    labels: labels,
    datasets: datasets
  };

  const options = {
    responsive: true,  // Ensures the chart resizes automatically
    scales: {
      x: {
        type: 'category', // Treat 'x' as categorical
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

  const handleGraphChange = () => {
    if (multiple) {
      setGraphNum((prevGraphNum) => (prevGraphNum === graphData.length - 1 ? 0 : prevGraphNum + 1));
    }
  };

  const handleGraphTypeChange = () => {
    setGraphType((prevType) => {
      const currentIndex = graphTypes.indexOf(prevType);
      return graphTypes[(currentIndex + 1) % graphTypes.length];
    });
  };

  const ChartComponent = graphType === 'line' ? Line : Bar;

  return (
    <div>
      <ChartComponent data={data} options={options} />
      <button style={{ display: multiple ? 'block' : 'none' }} onClick={handleGraphChange}>Change Graph Data</button>
      <button onClick={handleGraphTypeChange}>Change Graph Type</button>
    </div>
  );
}
