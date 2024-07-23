import {Scatter} from "react-chartjs-2";
import {Chart as ChartJS} from 'chart.js/auto'

function Scats({chartData}){
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return <div>Loading chart data or invalid input...</div>;
  }


  const options = {
    plugins: {
      tooltip: true,
      legend: {
        labels: {
          display: true,
          usePointStyle: true,
          boxWidth: 50,
          boxHeight: 50,
        },
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Number of words per text', // Replace with your x-axis label
        },
      },
      y: {
        title: {
          display: true,
          text: 'Seconds to respond', // Replace with your y-axis label
        },
      },
    },
  };

  const data = {
    labels: ['haha'],
    datasets :[
        {
            label: "Scatter Chart",
            data: chartData,
              
        }
    ]
  }


  return <Scatter data={data} options={options} />
    
}

export default Scats

