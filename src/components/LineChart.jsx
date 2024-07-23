import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import { Chart as ChartJS } from 'chart.js/auto';

function LineChart({ graphData }) {
    const [graphNum, setGraphNum] = useState(0);
    const [multiple, setMultiple] = useState(false);
    const [columns, setColumns] = useState([]);
    const [chartData, setChartData] = useState([]);

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

    const datasets = columns.map((column, index) => ({
        label: column,
        data: chartData.map((data) => data[column])
    }));

    const data = {
        labels: labels,
        datasets: datasets
    };

    const handleGraphChange = () => {
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
        <>
            <Line data={data} options={options} />
            <button style={{ display: multiple ? 'block' : 'none' }} onClick={handleGraphChange}>change</button>
        </>
    );
}

export default LineChart;


/*
import {Line} from "react-chartjs-2";
import {Chart as ChartJS} from 'chart.js/auto'

function LineChart({ graphData}) {


    
    const columns = graphData.columns
    const chartData = graphData.chartData
  
    const labels = chartData.map((data) => data.index);
    
    const datasets = columns.map((column, index) => ({
      label: column,
      data: chartData.map((data) => data[column])
    }));
  
    const data = {
      labels: labels,
      datasets: datasets
    }

    const options = {
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
        tooltip: true,
        legend: {
          display: true,
          position: 'top',
        },
      }
    }
    
  
    return <Line data={data} options = {options}/>
  }

export default LineChart
*/

/*import {Line} from "react-chartjs-2";
import {Chart as ChartJS} from 'chart.js/auto'

function LineChart({chartData}){

    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
        return <div>Loading chart data...</div>;
      }
    
        const labels = chartData.map((data) => data.index);
        const dataValues = chartData.map((data) => data.myself);
        const dataValues2 = chartData.map((data) => data.other);
        const label = "Number of Messages";
        const data = {
          labels: labels,
          datasets: [{
            label: label,
            data: dataValues
          },
          {
            label: label,
            data: dataValues2
          }]
        }
    
        return <Line data={data}/>

}

export default LineChart*/