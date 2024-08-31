import React, { useState,useEffect, useRef } from 'react';

import Chart from 'chart.js/auto';

export default function BubbleChart({ chartData, className }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [key, setKey] = useState([]);
  const [index, setIndex] = useState(0);
  const [graphData, setGraphData] = useState();
  const [chartLabels, setChartLabels] = useState("")
  const [multipler, setMultipler] = useState()

  useEffect(() =>{
    if (Object.keys(chartData).length > 1) {
      setKey( Object.keys(chartData));
    }
    //const temp = key[index]
    const temp = ["daynhour_self"]["datasets"];
    if (chartData[temp] && chartData[temp]['datasets']) {
      setGraphData(chartData[temp]['datasets'])
      setChartLabels(chartData[temp]['labels'])
      setMultipler(chartData[temp]['multiplier'])
    }
  },[index])

  useEffect(()=> {
    setGraphData(chartData['daynhour_self']['datasets'])
    
  },[])
  

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bubble',
      data: {
        datasets: graphData,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
            title: {
              display: false,
              text: chartLabels['x_axis'],
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
            display: false,
            text: chartLabels['title'],
          },
          tooltip: {
            callbacks: {
                label: function(context) {
                    const label = context.dataset.label || '';
                    const xLabel = context.raw.x;
                    const yLabel = context.raw.y;
                    const rValue = Math.round(context.raw.r * multipler); // Multiply the value by 8
                    return `${xLabel}, Hour ${yLabel}, ${rValue} Messages`;
                }
            }
        },
          legend: {
            display: false,
            position: 'top',
          },
        },
      },
    });
  }, [graphData]);

  return (
    <div className={className} >
      <canvas ref={chartRef} />

    </div>
  );
}
//<button onClick={()=>{setIndex(index >= key.length - 1 ? 0 : index +1); console.log(index)}}>change</button>

/*
      <div className='day-n-hour-buttons'>
        <button className={index === 0 ? "day-n-hour-button-on day-n-hour-button1": "day-n-hour-button day-n-hour-button1"} onClick={()=> {setIndex(0)}}>Total</button>
        <button className={index === 1 ? "day-n-hour-button-on day-n-hour-button1": "day-n-hour-button day-n-hour-button2"} onClick={()=> {setIndex(1)}}>You</button>
        <button className={index === 2 ? "day-n-hour-button-on day-n-hour-button1": "day-n-hour-button day-n-hour-button3"} onClick={()=> {setIndex(2)}}>Them</button>
      </div> */