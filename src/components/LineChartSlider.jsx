import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import { Chart as ChartJS } from 'chart.js/auto';

function LineChartSlider({ graphData }) {
    const [graphIndex, setGraphIndex] = useState(0);
    const [multiple, setMultiple] = useState(true);
    const [columns, setColumns] = useState([]);
    const [chartData, setChartData] = useState([]);

    const [key, setKey] = useState([]);
    const [index, setIndex] = useState(1);
    const [graphData2, setGraphData2] = useState(null);

    // Effect to set keys when graphData changes
    useEffect(() => {
        const keys = Object.keys(graphData);
        if (keys.length > 0) {
            setKey(keys);
            setGraphData2(graphData[keys[0]]);
        }
    }, [graphData]);

    // Effect to update graphData2 when index or key changes
    useEffect(() => {
        if (key.length > 0) {
            setGraphData2(graphData[key[index]]);
        }
    }, [index, key, graphData]);
    
    useEffect(() => {
        if(graphData2){
            if (Array.isArray(graphData2)) {
                setMultiple(true);
                console.log(graphIndex)
                console.log(graphData2[graphIndex])
                setColumns(graphData2[graphIndex].columns);
                setChartData(graphData2[graphIndex].chartData);
                console.log('changing graphData2')
            } else {
                setColumns(graphData2.columns);
                setChartData(graphData2.chartData);
                console.log('no multiple columns?')
            }
        }
    }, [graphData2, graphIndex]);

    const labels = chartData.map((data) => data.index);

    const datasets = columns.map((column, index) => ({
        label: column,
        data: chartData.map((data) => data[column])
    }));

    const data = {
        labels: labels,
        datasets: datasets
    };

    const handleSliderChange = (event) => {
        setGraphIndex(Number(event.target.value));
        console.log(graphIndex)
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'category',
                title: {
                    display: false,
                    text: 'Weekday',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Sentiment Value',
                },
            },
        },
        plugins: {
            title: {
              display: false,
              text: 'Your Chart Title Here',
            },
            tooltip: true,
            legend: {
                display: false,
                position: 'top',
            },
        }
    };

    return (
        <div className="sentiment-chart-slider-container">
            <div className="sentiment-linechart-container">
                <div className="sentiment-linechart">
                    {graphData2 && <Line data={data} options={options} />}
                </div>
                <div className='sentiment-buttons'>
                            <button className={index === 1 ? "sentiment-button-on sentiment-button1": "sentiment-button sentiment-button1"} onClick={()=> {setIndex(1)}}>You</button>
                            <button className={index === 2 ? "sentiment-button-on sentiment-button2": "sentiment-button sentiment-button2"} onClick={()=> {setIndex(2)}}>Them</button>
                            <button className={index === 0 ? "sentiment-button-on sentiment-button3": "sentiment-button sentiment-button3"} onClick={()=> {setIndex(0)}}>Total</button>
                </div>
                    
                
            </div>
            <div className="rolling-avg-slider-container">
                    <div className="text-center mt-2">
                            {graphIndex + 1} Day Rolling Average
                    </div>
                    <div className="mt-4">
                        <input 
                            type="range"
                            min="0"
                            max={graphData2 ? graphData2.length - 1 : 0}
                            value={graphIndex}
                            onChange={handleSliderChange}
                            className="w-full"
                        />

                    </div>
                    </div>
        </div>
    );
}

export default LineChartSlider;

