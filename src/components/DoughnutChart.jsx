// src/components/DoughnutChart.js

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ chartData, columns, nameMap, legend }) => {

  if (!chartData || !Array.isArray(chartData) || chartData.length === 0 || !columns || !Array.isArray(columns)) {
    return <div>Loading chart data or invalid input...</div>;
  }
  let labels = chartData.map((data) => data.index);
  
  //if (nameMap)
  //{
    //labels = chartData.map((data) => data.name);
  //}


  
  const datasets = columns
    .filter(column => column !== "name")  
    .map((column, index) => ({
      label: column,
      data: chartData.map((data) => data[column])
    }));
    

  const data = {
    labels: labels,
    datasets: datasets
  }

    
    

  const options = {
    plugins: {
      legend: {
        display: legend,
        position: 'top',
        labels: {
          filter: function(legendItem, data) {
            return legendItem.index < 5;
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);

                return {
                  text: `${label}: ${data.datasets[0].data[i]}`,
                  fillStyle: style.backgroundColor,
                  strokeStyle: style.borderColor,
                  lineWidth: style.borderWidth,
                  hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;