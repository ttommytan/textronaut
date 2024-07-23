import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function CustomRadarChart() {
  const labels = ['Health', 'Attack', 'Defense', 'Attack Speed', 'Movement Speed'];
  const values = [400, 50, 30, 2, 5];
  const maxValues = [500, 100, 100, 3, 10];

  const data = {
    labels: labels,
    datasets: [{
      label: 'Character Stats',
      data: values.map((value, index) => (value / maxValues[index]) * 100),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    }],
  };

  const options = {
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { 
          stepSize: 20,
          callback: (value) => `${value}%` 
        },
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            const value = values[index];
            const max = maxValues[index];
            let label = `${context.label}: ${value}`;
            if (context.label === 'Health') label += ' HP';
            if (context.label === 'Attack Speed') label += ' attacks/s';
            label += ` (Max: ${max})`;
            return label;
          }
        }
      }
    }
  };

  return <Radar data={data} options={options} />;
}

export default CustomRadarChart;