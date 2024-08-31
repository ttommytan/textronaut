import { useState, useEffect, createRef }  from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Heading from './components/Heading'
import Button from './components/Button'
import BarChart from './components/BarChart'; 
import Leaderboard from './components/Leaderboard';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import DoughnutChart from './components/DoughnutChart';
import { Bubble, Line } from 'react-chartjs-2';
import Home from './pages/Home';
import PhoneNumber from './pages/PhoneNumbers';
import NoPage from './pages/NoPage';
import Sample from './pages/Sample';
import BubbleChart from './components/BubbleChart';
import ScatterPlot from './components/ScatterPlot';
import Scats from './components/Scats';
import RadarChart from './components/RadarChart';
import CustomRadarChart from './components/CustomRadarChart';
/*
function App() {
  const fileInput = createRef();
  const [graphData, setGraphData] = useState({});
  const [loading, setLoading] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', fileInput.current.files[0])

    try {
      const options = {
        method: "POST",
        body: formData,
      }
      const response = await fetch("http://127.0.0.1:5000/upload", options)
      const data = await response.json();
      if(response.ok){
        alert("File Uploaded")
        fetchGraphData();
      }
      else{
        console.error("An error has occurred.")
      }
    } catch (e) {
      console.error(e.message)
    }
  }


  useEffect(() => {
    if (graphData && graphData.leaderboard && graphData.day_of_week_texts && graphData.monthly_texts) {
      setLoading(false)
    }
  }, [graphData]);

  useEffect(()=>{
    fetchGraphData();
  },[])


  const fetchGraphData = async () => {
    const options = {
      method: "GET",
      //headers: { 'Access-Control-Allow-Origin': '*', },
    }
    try{
      const response = await fetch("http://127.0.0.1:5000/", options);
      const data = await response.json();
      setGraphData(data); 
    }
    catch(error){
      console.error(error)
    }

  }

  if(loading){
    return (
    <>
      <div className="container">
        <Heading title="Textualize"/>
        <form onSubmit={onSubmit}>
          <input type="file" accept=".db" required className="hidden-btn" id="actual-btn" ref={fileInput} hidden/>
          <label htmlFor="actual-btn" className="actual-btn">Choose File</label>
          <input type="submit" value={"Analyze Now"}></input> 
        </form>
      </div>
      <div>loading</div>
    </>
    )
  }
  return(
    <>
      <div className="container">
        <Heading title="Textualize"/>
        <form onSubmit={onSubmit}>
          <input type="file" accept=".db" required className="hidden-btn" id="actual-btn" ref={fileInput} hidden/>
          <label htmlFor="actual-btn" className="actual-btn">Choose File</label>
          <input type="submit" value={"Analyze Now"}></input> 
        </form>
      </div>
      
      <div className="container-charts">
        <div className="chart-wrapper">
          <DoughnutChart chartData={graphData['leaderboard']['chartData']} columns={graphData['leaderboard']['columns']} />
        </div>
        <div className="chart-wrapper">
          <LineChart chartData={graphData['monthly_texts']['chartData']} columns={graphData['monthly_texts']['columns']} />
        </div>
        <div className="chart-wrapper">
          <BarChart chartData={graphData['day_of_week_texts']['chartData']} columns={graphData['day_of_week_texts']['columns']} />
        </div>
        <div className="chart-wrapper">
          <PieChart chartData={graphData['leaderboard']['chartData']} columns={graphData['leaderboard']['columns']} />

        </div>
        <Leaderboard data={graphData['leaderboard']['chartData']}></Leaderboard>

      </div>
      
    </>
  );
}
*/


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home></Home>}></Route>
          <Route path="/home" element={<Home></Home>} />
          <Route path="/phone-number/:number" element={<PhoneNumber />} />
          <Route path="/sample" element={<Sample></Sample>} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App


/*
function App() {
  const data = [{'x': 2, 'y': 110.68333333333334}, {'x': 2, 'y': 1036.5333333333333}, {'x': 15, 'y': 226.0}, {'x': 11, 'y': 60.333333333333336}, {'x': 3, 'y': 487.68333333333334}, {'x': 8, 'y': 406.95}, {'x': 4, 'y': 209.06666666666666}, {'x': 4, 'y': 37.983333333333334}, {'x': 13, 'y': 43.7}, {'x': 3, 'y': 145.8}, {'x': 12, 'y': 132.05}, {'x': 5, 'y': 123.01666666666667}, {'x': 19, 'y': 108.7}, {'x': 4, 'y': 37.38333333333333}, {'x': 3, 'y': 37.13333333333333}, {'x': 12, 'y': 444.48333333333335}, {'x': 8, 'y': 30.616666666666667}, {'x': 2, 'y': 327.5833333333333}, {'x': 3, 'y': 472.2}, {'x': 5, 'y': 88.86666666666666}, {'x': 4, 'y': 211.21666666666667}, {'x': 4, 'y': 183.8}, {'x': 2, 'y': 504.1}, {'x': 1, 'y': 503.4166666666667}, {'x': 4, 'y': 641.9333333333333}, {'x': 16, 'y': 893.6333333333333}, {'x': 2, 'y': 78.66666666666667}, {'x': 3, 'y': 1150.75}, {'x': 9, 'y': 61.7}, {'x': 4, 'y': 106.48333333333333}, {'x': 11, 'y': 529.6833333333333}, {'x': 14, 'y': 550.95}, {'x': 30, 'y': 64.5}, {'x': 2, 'y': 47.8}, {'x': 2, 'y': 190.26666666666668}, {'x': 54, 'y': 403.76666666666665}, {'x': 7, 'y': 98.03333333333333}, {'x': 6, 'y': 675.6666666666666}, {'x': 16, 'y': 749.0833333333334}, {'x': 8, 'y': 345.1166666666667}, {'x': 1, 'y': 76.13333333333334}, {'x': 1, 'y': 338.71666666666664}, {'x': 2, 'y': 981.55}, {'x': 5, 'y': 502.98333333333335}, {'x': 7, 'y': 225.46666666666667}, {'x': 3, 'y': 47.31666666666667}, {'x': 4, 'y': 55.083333333333336}, {'x': 6, 'y': 132.11666666666667}, {'x': 4, 'y': 104.33333333333333}, {'x': 16, 'y': 374.6333333333333}, {'x': 7, 'y': 150.6}, {'x': 4, 'y': 562.9333333333333}, {'x': 9, 'y': 78.56666666666666}, {'x': 3, 'y': 154.88333333333333}, {'x': 5, 'y': 40.85}, {'x': 7, 'y': 500.1}, {'x': 2, 'y': 97.11666666666666}, {'x': 9, 'y': 67.23333333333333}, {'x': 5, 'y': 43.43333333333333}, {'x': 6, 'y': 100.83333333333333}, {'x': 6, 'y': 141.36666666666667}, {'x': 5, 'y': 50.31666666666667}, {'x': 7, 'y': 69.3}, {'x': 2, 'y': 31.766666666666666}, {'x': 7, 'y': 598.4666666666667}, {'x': 8, 'y': 428.2}, {'x': 7, 'y': 634.4833333333333}, {'x': 1, 'y': 220.43333333333334}, {'x': 11, 'y': 1189.95}, {'x': 8, 'y': 266.8}, {'x': 19, 'y': 42.833333333333336}, {'x': 2, 'y': 44.95}, {'x': 4, 'y': 152.75}, {'x': 7, 'y': 123.76666666666667}, {'x': 4, 'y': 114.41666666666667}, {'x': 11, 'y': 35.38333333333333}, {'x': 2, 'y': 167.81666666666666}, {'x': 7, 'y': 285.18333333333334}, {'x': 1, 'y': 73.81666666666666}, {'x': 3, 'y': 544.2166666666667}, {'x': 2, 'y': 68.7}, {'x': 6, 'y': 179.4}, {'x': 1, 'y': 42.46666666666667}, {'x': 1, 'y': 377.75}, {'x': 1, 'y': 30.683333333333334}, {'x': 1, 'y': 172.31666666666666}, {'x': 6, 'y': 49.13333333333333}, {'x': 2, 'y': 68.05}, {'x': 1, 'y': 79.23333333333333}, {'x': 1, 'y': 1379.95}, {'x': 9, 'y': 186.25}, {'x': 1, 'y': 36.18333333333333}, {'x': 6, 'y': 33.81666666666667}, {'x': 6, 'y': 1196.0333333333333}, {'x': 6, 'y': 400.75}, {'x': 6, 'y': 603.6833333333333}, {'x': 2, 'y': 59.083333333333336}, {'x': 4, 'y': 87.0}, {'x': 1, 'y': 619.5}, {'x': 4, 'y': 436.51666666666665}, {'x': 2, 'y': 388.6333333333333}, {'x': 12, 'y': 39.65}, {'x': 6, 'y': 64.1}, {'x': 1, 'y': 40.36666666666667}, {'x': 3, 'y': 60.266666666666666}, {'x': 4, 'y': 49.68333333333333}, {'x': 16, 'y': 82.58333333333333}, {'x': 9, 'y': 50.65}, {'x': 6, 'y': 81.3}, {'x': 7, 'y': 155.81666666666666}, {'x': 1, 'y': 35.35}, {'x': 1, 'y': 454.0}, {'x': 10, 'y': 749.5333333333333}, {'x': 5, 'y': 130.41666666666666}, {'x': 4, 'y': 132.13333333333333}, {'x': 2, 'y': 67.1}, {'x': 3, 'y': 192.43333333333334}, {'x': 6, 'y': 520.2166666666667}, {'x': 4, 'y': 121.28333333333333}, {'x': 9, 'y': 64.36666666666666}, {'x': 1, 'y': 51.75}, {'x': 7, 'y': 97.75}, {'x': 2, 'y': 54.93333333333333}, {'x': 9, 'y': 74.21666666666667}, {'x': 10, 'y': 36.65}, {'x': 6, 'y': 1379.2833333333333}, {'x': 6, 'y': 1169.2666666666667}, {'x': 2, 'y': 218.03333333333333}, {'x': 2, 'y': 41.3}, {'x': 1, 'y': 249.98333333333332}, {'x': 6, 'y': 49.43333333333333}, {'x': 1, 'y': 676.2833333333333}, {'x': 16, 'y': 192.76666666666668}, {'x': 1, 'y': 48.333333333333336}, {'x': 11, 'y': 411.28333333333336}, {'x': 12, 'y': 104.91666666666667}, {'x': 11, 'y': 113.71666666666667}, {'x': 12, 'y': 874.9833333333333}, {'x': 11, 'y': 184.7}, {'x': 3, 'y': 43.166666666666664}, {'x': 5, 'y': 255.86666666666667}, {'x': 7, 'y': 646.9666666666667}, {'x': 1, 'y': 91.8}, {'x': 3, 'y': 40.266666666666666}, {'x': 14, 'y': 286.18333333333334}, {'x': 3, 'y': 1114.0}, {'x': 1, 'y': 103.51666666666667}, {'x': 4, 'y': 1272.45}, {'x': 5, 'y': 169.31666666666666}, {'x': 4, 'y': 202.61666666666667}, {'x': 4, 'y': 38.016666666666666}, {'x': 4, 'y': 46.61666666666667}, {'x': 8, 'y': 96.33333333333333}, {'x': 1, 'y': 113.06666666666666}, {'x': 13, 'y': 540.4333333333333}, {'x': 5, 'y': 171.5}, {'x': 2, 'y': 129.98333333333332}, {'x': 3, 'y': 119.21666666666667}, {'x': 4, 'y': 1096.5333333333333}, {'x': 4, 'y': 101.05}, {'x': 2, 'y': 125.63333333333334}, {'x': 9, 'y': 31.0}, {'x': 3, 'y': 47.516666666666666}, {'x': 6, 'y': 206.5}, {'x': 4, 'y': 88.25}, {'x': 6, 'y': 962.7333333333333}, {'x': 3, 'y': 45.65}, {'x': 13, 'y': 44.25}, {'x': 3, 'y': 113.43333333333334}, {'x': 5, 'y': 872.0833333333334}, {'x': 6, 'y': 536.8833333333333}, {'x': 1, 'y': 152.01666666666668}, {'x': 1, 'y': 712.0333333333333}, {'x': 5, 'y': 108.35}, {'x': 8, 'y': 700.4166666666666}, {'x': 3, 'y': 80.53333333333333}, {'x': 5, 'y': 58.7}, {'x': 9, 'y': 783.8833333333333}, {'x': 1, 'y': 938.4833333333333}, {'x': 1, 'y': 53.55}, {'x': 5, 'y': 147.5}, {'x': 11, 'y': 650.3833333333333}, {'x': 3, 'y': 32.7}, {'x': 1, 'y': 41.983333333333334}, {'x': 5, 'y': 123.13333333333334}, {'x': 13, 'y': 767.7333333333333}, {'x': 3, 'y': 393.51666666666665}, {'x': 1, 'y': 124.88333333333334}, {'x': 10, 'y': 38.2}, {'x': 7, 'y': 107.38333333333334}, {'x': 13, 'y': 527.8333333333334}, {'x': 6, 'y': 155.36666666666667}, {'x': 2, 'y': 46.81666666666667}, {'x': 4, 'y': 30.783333333333335}, {'x': 6, 'y': 1106.5666666666666}, {'x': 9, 'y': 36.06666666666667}, {'x': 6, 'y': 254.03333333333333}, {'x': 1, 'y': 90.53333333333333}, {'x': 1, 'y': 77.3}, {'x': 4, 'y': 182.13333333333333}, {'x': 1, 'y': 102.63333333333334}, {'x': 1, 'y': 34.11666666666667}, {'x': 8, 'y': 39.666666666666664}, {'x': 3, 'y': 66.88333333333334}, {'x': 6, 'y': 605.1166666666667}, {'x': 21, 'y': 49.36666666666667}, {'x': 3, 'y': 35.1}, {'x': 4, 'y': 139.35}, {'x': 3, 'y': 483.98333333333335}, {'x': 3, 'y': 78.28333333333333}, {'x': 1, 'y': 157.83333333333334}, {'x': 7, 'y': 101.41666666666667}, {'x': 1, 'y': 39.35}, {'x': 2, 'y': 67.5}, {'x': 3, 'y': 153.61666666666667}, {'x': 2, 'y': 547.8666666666667}, {'x': 1, 'y': 52.083333333333336}, {'x': 3, 'y': 49.333333333333336}, {'x': 7, 'y': 133.01666666666668}, {'x': 1, 'y': 38.2}, {'x': 6, 'y': 291.8333333333333}, {'x': 1, 'y': 156.31666666666666}, {'x': 4, 'y': 396.28333333333336}, {'x': 6, 'y': 428.01666666666665}, {'x': 3, 'y': 94.85}, {'x': 4, 'y': 411.43333333333334}, {'x': 5, 'y': 37.8}, {'x': 6, 'y': 32.86666666666667}, {'x': 13, 'y': 314.1166666666667}, {'x': 16, 'y': 36.083333333333336}, {'x': 5, 'y': 116.55}, {'x': 4, 'y': 666.0833333333334}, {'x': 4, 'y': 37.916666666666664}, {'x': 4, 'y': 431.01666666666665}, {'x': 2, 'y': 76.43333333333334}, {'x': 6, 'y': 787.5333333333333}, {'x': 3, 'y': 333.78333333333336}, {'x': 5, 'y': 39.833333333333336}, {'x': 3, 'y': 718.6833333333333}, {'x': 2, 'y': 66.73333333333333}, {'x': 1, 'y': 48.95}, {'x': 4, 'y': 815.7}, {'x': 3, 'y': 191.56666666666666}, {'x': 4, 'y': 101.08333333333333}, {'x': 23, 'y': 90.48333333333333}, {'x': 8, 'y': 678.0666666666667}, {'x': 1, 'y': 66.55}, {'x': 6, 'y': 124.08333333333333}, {'x': 1, 'y': 77.36666666666666}, {'x': 260, 'y': 73.25}, {'x': 5, 'y': 295.4166666666667}, {'x': 4, 'y': 36.95}, {'x': 6, 'y': 47.31666666666667}, {'x': 7, 'y': 63.95}, {'x': 2, 'y': 224.91666666666666}, {'x': 2, 'y': 177.63333333333333}, {'x': 1, 'y': 35.15}, {'x': 3, 'y': 146.55}, {'x': 4, 'y': 52.96666666666667}, {'x': 3, 'y': 371.45}, {'x': 1, 'y': 244.61666666666667}, {'x': 3, 'y': 120.73333333333333}, {'x': 2, 'y': 33.03333333333333}, {'x': 5, 'y': 875.9333333333333}, {'x': 1, 'y': 37.18333333333333}, {'x': 4, 'y': 50.43333333333333}, {'x': 10, 'y': 187.55}, {'x': 2, 'y': 32.233333333333334}, {'x': 5, 'y': 187.95}, {'x': 1, 'y': 51.766666666666666}, {'x': 14, 'y': 217.95}, {'x': 4, 'y': 117.3}, {'x': 7, 'y': 36.65}, {'x': 1, 'y': 55.483333333333334}, {'x': 19, 'y': 111.01666666666667}, {'x': 3, 'y': 484.85}, {'x': 8, 'y': 238.4}, {'x': 1, 'y': 47.75}, {'x': 6, 'y': 47.38333333333333}, {'x': 4, 'y': 85.98333333333333}, {'x': 42, 'y': 526.9333333333333}, {'x': 3, 'y': 341.3}, {'x': 1, 'y': 40.25}, {'x': 4, 'y': 46.55}, {'x': 11, 'y': 291.8833333333333}, {'x': 4, 'y': 89.15}, {'x': 3, 'y': 41.46666666666667}, {'x': 7, 'y': 97.61666666666666}, {'x': 2, 'y': 46.766666666666666}, {'x': 1, 'y': 42.31666666666667}, {'x': 3, 'y': 38.4}, {'x': 1, 'y': 635.0666666666667}, {'x': 3, 'y': 50.81666666666667}, {'x': 6, 'y': 42.53333333333333}, {'x': 1, 'y': 58.3}, {'x': 14, 'y': 330.53333333333336}, {'x': 4, 'y': 207.71666666666667}, {'x': 5, 'y': 37.88333333333333}, {'x': 7, 'y': 266.73333333333335}, {'x': 2, 'y': 450.26666666666665}, {'x': 2, 'y': 1070.1}, {'x': 1, 'y': 50.71666666666667}, {'x': 4, 'y': 1021.8}, {'x': 21, 'y': 84.5}, {'x': 1, 'y': 174.78333333333333}, {'x': 12, 'y': 1057.7833333333333}, {'x': 1, 'y': 100.61666666666666}, {'x': 4, 'y': 35.45}, {'x': 1, 'y': 497.43333333333334}, {'x': 2, 'y': 128.16666666666666}, {'x': 2, 'y': 42.3}, {'x': 1, 'y': 264.55}, {'x': 1, 'y': 298.43333333333334}, {'x': 9, 'y': 116.61666666666666}, {'x': 1, 'y': 31.033333333333335}, {'x': 7, 'y': 85.63333333333334}, {'x': 1, 'y': 1054.7833333333333}, {'x': 1, 'y': 303.05}, {'x': 4, 'y': 54.166666666666664}, {'x': 7, 'y': 510.68333333333334}, {'x': 3, 'y': 44.88333333333333}, {'x': 8, 'y': 50.016666666666666}, {'x': 7, 'y': 37.68333333333333}]
  const [dat, setDat] = useState(true);
  const plus = () =>{
    setDat(dat+1)
  }
  const labels = ['avg_sentiment', 'avg_response_time', 'avg_text_lengths']
  const graphData = [{'label': '+17146566892', 
                      'data': [0.0, 0.0, 0.0]
                    }, {
                      'label': '+14088893810', 
                      'data': [0.08632338016221275, 0.03281203532796517, 0.1120017278783434]
                    }, {
                      'label': '+18082923894', 'data': [1.0, 1.0000000000000002, 0.9999999999999998]
                    }, {'label': '+819086845393', 
                    'data': [0.11003976965892803, 0.3069065002818352, 0.00807286167025234]
                    }, {'label': '+16614143944', 
                    'data': [0.10846937644677623, 0.8659009143813365, 0.2773169917169185]}]
  return(
  <>
    <h1 onDoubleClick={() => setDat(0)}>{dat}</h1>
    <h1 onDoubleClick={()=> {dat ? setDat(0) : setDat(100)}}>testing some charts</h1>
    <BubbleChart></BubbleChart>
    <ScatterPlot chartData ={data}/>
    <Scats chartData ={data}/>
    <RadarChart chartData={graphData} columns = {labels}></RadarChart>
    

  </>)
}
export default App


const labels = ['HP', 'HP Regen', 'AD', 'AS', 'Armor'];
const datasets = [
  {
    label: 'User 1',
    data: [395, 5.75, 55.00, 0.65, 14.00], // Original values
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1
  },
  {
    label: 'User 2',
    data: [250, 4.50, 48.80, 0.63, 7.40], // Original values
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1
  }
];

const scales = [
  { min: 0, max: 400, stepSize: 100, label: 'HP' },
  { min: 0, max: 10, stepSize: 2, label: 'HP Regen' },
  { min: 0, max: 60, stepSize: 10, label: 'AD' },
  { min: 0, max: 1, stepSize: 0.2, label: 'AS' },
  { min: 0, max: 20, stepSize: 4, label: 'Armor' }
];

function App() {
  return (
    <div>
      <h2>Custom Radar Chart with Different Scales</h2>
      <CustomRadarChart /> 
    </div>
  );
}

export default App;*/