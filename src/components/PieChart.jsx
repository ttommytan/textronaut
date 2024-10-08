import {Pie} from "react-chartjs-2";
import {Chart as ChartJS} from 'chart.js/auto'

function PieChart({chartData, columns}){
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0 || !columns || !Array.isArray(columns)) {
    return <div>Loading chart data or invalid input...</div>;
  }

  const labels = chartData.map((data) => data.index);
  
  const datasets = columns.map((column, index) => ({
    label: column,
    data: chartData.map((data) => data[column])
  }));

  const data = {
    labels: labels,
    datasets: datasets
  }

  return <Pie data={data} />
    
}

export default PieChart

