import { useParams } from 'react-router-dom';
import { useState, useEffect, createRef } from 'react';
import React from 'react';
import WordCloud from '../components/WordCloud';
import Scats from '../components/Scats';
import AllCharts from '../components/AllCharts';
//function PhoneNumber() {}
    /*
    const { number } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [num, setNum] = useState(0);


    const fetchData = async () => {
        const options = {
          method: "GET",
          headers: { 'Access-Control-Allow-Origin': '*', },
        }
        try{
          const response = await fetch(`http://127.0.0.1:5000/phone-number/${number}`, options);
          const data = await response.json();
          setData(data)
          setNum(number)
        }
        catch(error){
          console.error('Error fetching data:', error);
          console.error(error)
        }
    
      }
    
    useEffect(()=> fetchData,[])

    */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Heading from '../components/Heading'
import Button from '../components/Button'
import BarChart from '../components/BarChart'; 
import Leaderboard from '../components/Leaderboard';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import DoughnutChart from '../components/DoughnutChart';
import { Line } from 'react-chartjs-2';
import NoPage from '../pages/NoPage';
import BubbleChart from '../components/BubbleChart';



function PhoneNumber() {
    const { number } = useParams();
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGraphData();
    }, [number]);

    const fetchGraphData = async () => {
        const options = {
            method: "GET",
        }
        try {
            console.log(`Fetching data for number: ${number}`);
            const response = await fetch(`http://127.0.0.1:5000/phone-number/${number}`, options);
            console.log('Response received:', response);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
            }
            const data = await response.json();
            console.log('Data received:', data);
            setGraphData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error in fetchGraphData:', error);
            setError(error.message);
            setLoading(false);
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!graphData) {
        return <p>No data available for this number.</p>;
    }

    const bothRepeats = [graphData.repeat, graphData.repeat3]
    const bothDoubles = [graphData.double_text, graphData.double_text_hr]

    

return (
        <>
            <div className="container">
                <p>Phone Number: {number}</p>
            </div>
            <div className="container-charts">
                {graphData.monthly_texts && (
                    <div className="chart-wrapper">
                        <LineChart 
                            graphData={graphData['monthly_texts']} 
                        />
                    </div>
                )}
            </div>
            <div className="container-charts">
                {graphData.repeat && (
                    <div className="chart-wrapper">
                        <LineChart 
                            graphData={bothRepeats} 
                        />
                    </div>
                )}
            </div>
            <div className="container-charts">
                {graphData.emojis && (
                    <div className="chart-wrapper">
                        <LineChart 
                            graphData={graphData['emojis']} 
                        />
                    </div>
                )}
            </div>
            <div className="container-charts">
                {graphData.double_text_hr && (
                    <div className="chart-wrapper">
                        <LineChart 
                            graphData={bothDoubles} 
                        />
                    </div>
                )}
            
                    <WordCloud width={500} height={500} showControls={true} wordList={graphData['word_cloud']}/>
                    <LineChart graphData={graphData['sentiment_by_date']} />
                    <Scats chartData={graphData['time_per_words']}/>
                    <BubbleChart chartData ={graphData['day_n_hour']}/>
            </div>
            <div className="container-charts">
                {graphData.repeat && (
                    <div className="chart-wrapper">
                        <AllCharts 
                            graphData={bothDoubles}            
                        />
                    </div>
                )}
            </div>

        </>
    );

}

export default PhoneNumber;
