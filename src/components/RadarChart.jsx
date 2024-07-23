import {Radar} from "react-chartjs-2";
import {Chart as ChartJS} from 'chart.js/auto'

function RadarChart({chartData, columns}){



  const data = {
    labels: columns,
    datasets: chartData,
  };


  return <Radar data={data} />
    
}

export default RadarChart

