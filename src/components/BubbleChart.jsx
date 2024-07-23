import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function BubbleChart({ chartData, className }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bubble',
      data: {
        datasets: chartData,
      },
      options: {
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
          tooltip: true,
          legend: {
            display: false,
            position: 'top',
          },
        },
      },
    });
  }, [chartData]);

  return (
    <div className={className} >
      <canvas ref={chartRef} />
    </div>
  );
}
