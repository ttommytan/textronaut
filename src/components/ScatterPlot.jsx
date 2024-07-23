import React from 'react';
import { Radar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

function ScatterPlot({ labels, datasets, scales }) {
  const data = {
    labels: ['Health', 'Attack', 'Defense', 'Attack Speed', 'Movement Speed'],
    datasets: [
      {
        label: 'Character Stats',
        data: [400, 50, 30, 2, 5],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { display: true },
        pointLabels: { font: { size: 14 } },
        ticks: { callback: () => '' },
        min: 0,
        max: 1,
        ticks: { stepSize: 0.2 }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.r !== null) {
              label += context.parsed.r;
              if (context.label === 'Health') label += ' HP';
              if (context.label === 'Attack Speed') label += ' attacks/s';
            }
            return label;
          }
        }
      }
    },
    elements: { point: { radius: 0 } },
    parsing: {
      xAxisKey: 'label',
      yAxisKey: 'normalizedValue'
    }
  };

  const maxValues = {
    Health: 500,
    Attack: 100,
    Defense: 100,
    'Attack Speed': 3,
    'Movement Speed': 10
  };

  const normalizedData = data.datasets[0].data.map((value, index) => ({
    label: data.labels[index],
    normalizedValue: value / maxValues[data.labels[index]]
  }));

  const normalizedDataset = {
    ...data.datasets[0],
    data: normalizedData
  };

  return <Radar data={{...data, datasets: [normalizedDataset]}} options={options} />;

}

export default ScatterPlot;