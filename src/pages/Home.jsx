
import { useState, useEffect, createRef }  from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Heading from '../components/Heading'
import Button from '../components/Button'
import BarChart from '../components/BarChart'; 
import Leaderboard from '../components/Leaderboard';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import DoughnutChart from '../components/DoughnutChart';
import { Line, Scatter } from 'react-chartjs-2';
import PhoneNumber from '../pages/PhoneNumbers';
import NoPage from '../pages/NoPage';
import WordCloud from '../components/WordCloud';
import ScatterPlot from '../components/ScatterPlot';
import BubbleChart from '../components/BubbleChart';
import RadarChart from '../components/RadarChart';
import Popup from '../components/Popup';
import HashLoader from "react-spinners/HashLoader";

//for the problem of having to analyze twice when theres a vcf upload, just run it twice
function Home() {
    const fileInput = createRef();
    const fileInput2 = createRef();

    const [graphData, setGraphData] = useState({});
    const [loading, setLoading] = useState(true);
    const [analyzeLoader, setAnalyzeLoader] = useState(false)
    const [readyCloud, setReadyCloud] = useState(false)
    const [nameMap, setNameMap] = useState(false)
    const [dbFileName, setDbFileName] = useState('');
    const [vcfFileName, setVcfFileName] = useState('');
    const [buttonPopup, setButtonPopup] = useState(false)
    const [seeMore, setSeeMore] = useState(true)

    const override = {
      display: "block",
      margin: "5 auto",
      borderColor: "red",
    };
    

    const overallStats = [<b>This year you ventured into the social-verse and made 9 new friends, look at you you social butterfly
                              From sunrise to sunset you kept texting blank
                              Your morning started with blank
                              You siezed the day with blank
                              You embraced the night with blank
                          </b>, 
                          <b>
                          All that texting added up to around 20,000 minutes!<br/>
                          With one person it was love at first text: Kara!<br/>
                          You texted over 200 people but you texted these people again and again.: 1, 2, 3,...<br/>
                      
                          </b>,
                          <b>
                            You also used 2000 words but your top 5 favorite words are ...<br/>
                            Peak texting months
                            Time to meet your texting personality.<br/>
                          </b>];

  const [statsIndex, setStatsIndex] = useState(0)

  const handleDbFileChange = () => {
      if (fileInput.current.files.length > 0) {
        setDbFileName(fileInput.current.files[0].name);
      }
    };
    const handleVcfFileChange = () => {
      if (fileInput2.current.files.length > 0) {
        setVcfFileName(fileInput2.current.files[0].name);
      }
    };
    const onSubmit = async (e) => {
      e.preventDefault();
      const messages_db = new FormData();
      const contacts_vcf = new FormData();

      messages_db.append('file', fileInput.current.files[0])
      
    
      try {
        setAnalyzeLoader(true)
        const options = {
          method: "POST",
          body: messages_db,
        }
        if(!fileInput.current.files[0])
        {
          alert('Please upload your messages')
        }
        if(fileInput2.current.files[0]){
          contacts_vcf.append('file', fileInput2.current.files[0])
          console.log('in contacts')
          setNameMap(true)
          const options2 = {
            method: "POST",
            body: contacts_vcf,
          }
          const contacts_response = await fetch("http://127.0.0.1:5000/upload/contacts", options2)
          const data = await contacts_response.json();
          if(contacts_response.ok){
            //alert("Contacts Uploaded")
            fetchGraphData();
          }
          else{
            console.error("An error has occurred.")
            setAnalyzeLoader(false)
          }
        }
        const response = await fetch("http://127.0.0.1:5000/upload", options)
        const data = await response.json();
        if(response.ok){
          //alert("File Uploaded")
          fetchGraphData();
        }
        else{
          setAnalyzeLoader(false)
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
      console.log(loading)
    }, [graphData]);
  

  
    const fetchGraphData = async () => {
      const options = {
        method: "GET",
        headers: { 'Access-Control-Allow-Origin': '*', },
      }
      try{
        console.log('the trouble is below')
        const response = await fetch("http://127.0.0.1:5000/", options);
        console.log('the trouble is above')
        const data = await response.json();
        setGraphData(data)
      }
      catch(error){
        console.error(error)
      }
      setAnalyzeLoader(false)
    }

    const fetchGraphData2 = async () => {
      const options = {
        method: "GET",
        //headers: { 'Access-Control-Allow-Origin': '*', },
      }
      try{
        const response = await fetch("http://127.0.0.1:5000/charts", options);
        const data = await response.json();
        setReadyCloud(data['word_cloud']); 
      }
      catch(error){
        console.error(error)
      }
  
    }



    if(loading){
      return (
      <>
        <Heading title="Textualize"/>

          
          <form className="upload-container"onSubmit={onSubmit}>
            <input type="file" accept=".db" onChange={handleDbFileChange} required className="hidden-btn" id="actual-btn" ref={fileInput} hidden/>
            <label htmlFor="actual-btn" className="actual-btn">Choose File</label>
            {dbFileName && <span>{dbFileName}</span>}
            <input type="file" accept=".vcf" onChange={handleVcfFileChange} className="hidden-btn" id="other-btn" ref={fileInput2} hidden/>
            <label htmlFor="other-btn" className="actual-btn">Upload Contacts File</label>
            {vcfFileName && <span>{vcfFileName}</span>}
            <input type="submit" className="analyze-btn" value={"Analyze Now"}></input> 
            {
              analyzeLoader ? 
              <HashLoader
              className='analyze-loader'
              color={'#3A4A92'}
              loading={analyzeLoader}
              size={50}
              data-testid="loader"
              speedMultiplier={1}
              />
              :
              ""
            }  

          </form>

        <button  onClick={() => setButtonPopup(true)}>Open Your Text Recap</button>
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup} statsIndex={statsIndex} setStatsIndex={setStatsIndex} length={overallStats.length}>
          {overallStats[statsIndex]}
        </Popup>
        <div></div>
      </>
      )
    }
    return(
      
      <>
        <Heading title="Textualize"/>
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup} statsIndex={statsIndex} setStatsIndex={setStatsIndex} length={overallStats.length}>
          {overallStats[statsIndex]}
        </Popup>
        <button onClick={() => setButtonPopup(true)}>Open Your Text Recap</button>
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup} statsIndex={statsIndex} setStatsIndex={setStatsIndex} length={overallStats.length}>
          {overallStats[statsIndex]}
        </Popup>

        <div className="container-charts">
          <div className="chart-wrapper">
            <DoughnutChart chartData={graphData['leaderboard']['chartData']} columns={graphData['leaderboard']['columns']} nameMap={nameMap}/>
          </div>
          <div className="chart-wrapper">
            <LineChart graphData={graphData['monthly_texts']} />
          </div>
          <div className="chart-wrapper">
            <BubbleChart className="day-n-hour-inside" chartData ={graphData['day_n_hour']}/>
          </div>
          <div className="chart-wrapper">
            <BarChart chartData={graphData['day_of_week_texts']['chartData']} columns={graphData['day_of_week_texts']['columns']} />
          </div>
          <div className="word-cloud">
            <WordCloud width={500} height={500} showControls={true} wordList={graphData['word_cloud']}/>          
          </div>

         
          <div className="chart-wrapper">
            <LineChart graphData={graphData['sentiment_by_date']} />
          </div>
          <div className="chart-wrapper">
            <RadarChart chartData={graphData['avg_stats_comparison']['chartData']} columns={graphData['avg_stats_comparison']['columns']}/>
          </div>

          <div>  
            <Leaderboard data={graphData['leaderboard']['chartData']} seeMore={seeMore} nameMap={nameMap}></Leaderboard>
            <button onClick={()=>setSeeMore(!seeMore)}>{seeMore ? "See More" : "Hide"}</button>
          </div>
          
        </div>

      </>
    
      );
  }


export default Home