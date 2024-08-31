import { useParams } from 'react-router-dom';
import { useState, useEffect, createRef } from 'react';
import React from 'react';
import WordCloud from '../components/WordCloud';
import Scats from '../components/Scats';
import AllCharts from '../components/AllCharts';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from '../components/Navbar';
import HashLoader from "react-spinners/HashLoader";

import {
  faHeart,
  faThumbsDown,
  faThumbsUp,
  faQuestion,
  faExclamation,
  faFaceLaugh,
  faVideo,
  faChevronUp,
  faChevronDown,
  faPlus,
  faArrowUp,
  faX,
  faMinus,
  faDownLeftAndUpRightToCenter,
  faRefresh,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
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
import LineChartSlider from '../components/LineChartSlider';
import RatioBar from '../components/RatioBar';




function PhoneNumber() {
    const { number } = useParams();
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nameMap, setNameMap] = useState(false);
    const [graphName, setGraphName] = useState("Double texts per month");
    const [graphState, setGraphState] = useState(false)

    useEffect(() => {
        fetchGraphData();
        console.log(number)
        console.log('fetching again')
    }, [number]);
    useEffect(()=>{
      if (graphState){
        setGraphName("Double texts per hour")
      }
      else{
        setGraphName("Double texts per month")
      }
    },[graphState])
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
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              flexDirection: "column",
            }}
          >
            <HashLoader
              className="analyze-loader"
              color={"#0786ff"}
              loading={loading}
              size={90}
              data-testid="loader"
              speedMultiplier={1}
            />
            <div style={{ marginTop: "8%" }}>Loading ...
             This will take a bit, feel free to go back and look around more </div>
          </div>
        );
    }

    if (error) {
      console.log(error)
        return <div>Sorry there's not enough available data for this number.</div>
    }

    if (!graphData) {
        return <p>No data available for this number.</p>;
    }

    const bothRepeats = [graphData.repeat, graphData.repeat3]
    const bothDoubles = [graphData.double_text, graphData.double_text_hr]
  let peakHr
  let rotationAngle
  let sentimentEmoji
  if (!loading){
    peakHr = graphData.peak_text_hr.peak_hr;
    if (peakHr > 12) {
      peakHr = (peakHr - 12).toString() + " PM";
    } else if (peakHr === 0) {
      peakHr = "12 AM";
    } else {
      peakHr = peakHr.toString() + " AM";
    }
    rotationAngle = (30 * graphData.peak_text_hr.peak_hr - 90).toString() + "deg"
    const bothSent =
      (graphData.overall_sent.self_sent + graphData.overall_sent.other_sent) /
      2;
    if (bothSent >= 0.05) {
      sentimentEmoji = "🙂";
    } else if (bothSent < 0.05 && bothSent >= 0.0) {
      sentimentEmoji = "😐";
    } else if (bothSent < 0.0) {
      sentimentEmoji = "🙁";
    }
    
  }
  let reaction_dict = {};
  reaction_dict["loved"] = <FontAwesomeIcon className="heart" icon={faHeart} />;
  reaction_dict["liked"] = (
    <FontAwesomeIcon className="heart" icon={faThumbsDown} />
  );
  reaction_dict["disliked"] = (
    <FontAwesomeIcon className="heart" icon={faThumbsUp} />
  );
  reaction_dict["laughed"] = (
    <FontAwesomeIcon className="heart" icon={faFaceLaugh} />
  );
  reaction_dict["emphasized"] = (
    <FontAwesomeIcon className="heart" icon={faExclamation} />
  );
  reaction_dict["questioned"] = (
    <FontAwesomeIcon className="heart" icon={faQuestion} />
  );

return (
  <>
    <Navbar />
    <div className="background">
      <div className="container-charts">
        <div className="container-title">
          Your text life with{" "}
          {graphData.name_map ? graphData.name_map[number] : graphData.number}
        </div>
        <div className="all-stats personal-stats">
          <div className="personal-stat">
            <span className="personal-stat-title">Total messages</span>
            <span className="personal-stat-number">
              {(
                graphData.total_messages.self + graphData.total_messages.other
              ).toLocaleString()}
            </span>
            <span className="personal-stat-additional">
              You: {graphData.total_messages.self.toLocaleString()} | Them:{" "}
              {graphData.total_messages.other.toLocaleString()}
            </span>
            <span className="personal-stat-visual">
              <div className="visual-bars">
                <div
                  className="visual-bar1"
                  style={{
                    width: `${
                      graphData.total_messages.self >
                      graphData.total_messages.other
                        ? 100
                        : (100 * graphData.total_messages.self) /
                          graphData.total_messages.other
                    }%`,
                  }}
                >
                  {" "}
                  {Math.round(
                    (graphData.total_messages.self /
                      (graphData.total_messages.self +
                        graphData.total_messages.other)) *
                      100
                  )}
                  %
                </div>
                <div
                  className="visual-bar2"
                  style={{
                    width: `${
                      graphData.total_messages.other >
                      graphData.total_messages.self
                        ? 100
                        : (100 * graphData.total_messages.other) /
                          graphData.total_messages.self
                    }%`,
                  }}
                >
                  {" "}
                  {Math.round(
                    (graphData.total_messages.other /
                      (graphData.total_messages.self +
                        graphData.total_messages.other)) *
                      100
                  )}
                  %
                </div>
              </div>
            </span>
          </div>
          <div className="personal-stat">
            <span className="personal-stat-title">Overall sentiment</span>
            <span className="personal-stat-number">
              {(
                (graphData.overall_sent.self_sent +
                  graphData.overall_sent.other_sent) /
                2
              ).toFixed(2)}
            </span>
            <span className="personal-stat-visual">
              <span className="personal-stat-visual-emoji">
                {sentimentEmoji}
              </span>
            </span>
            <span className="personal-stat-additional">
              You: {graphData.overall_sent.self_sent.toFixed(2)} | Them:{" "}
              {graphData.overall_sent.other_sent.toFixed(2)}
            </span>
          </div>
          <div className="personal-stat">
            <span className="personal-stat-title">Double texts</span>
            <span className="personal-stat-number">
              {graphData.overall_double_text.double_text_total.toLocaleString()}
            </span>
            <span className="personal-stat-visual">
              <div className="guess-text-container guess-text-container-visual">
                <div className="text-self-visual">plz</div>
                <div className="text-self-visual">respond</div>
              </div>
            </span>
            <span className="personal-stat-additional">
              You: {graphData.overall_double_text.double_text_self} | Them:{" "}
              {graphData.overall_double_text.double_text_other.toLocaleString()}
            </span>
          </div>
          <div className="personal-stat">
            <span className="personal-stat-title">Peak Activity Time</span>
            <span className="personal-stat-number">{peakHr}</span>
            <span className="personal-stat-visual">
              <div className="visual-clock">
                <div className="visual-circle">
                  <div className="visual-min"> </div>
                  <div
                    className="visual-hour"
                    style={{ transform: `rotate(${rotationAngle})` }}
                  ></div>
                  <div className="visual-dot"> </div>
                </div>
              </div>
            </span>
            <span className="personal-stat-additional">
              {graphData.peak_text_hr.max_texts.toLocaleString()} total messages
            </span>
          </div>
        </div>

        <div className="personal-row1">
          <div className="chart-wrapper">
            <span className="container-title">First encounter</span>

            <div className="guess-text-container">
              <span
                className={
                  graphData.first_encounter.first_text[1] === "self"
                    ? "text-self"
                    : "text-other"
                }
              >
                {graphData.first_encounter.first_text[0]}
              </span>
              <span
                className="timestamp"
                style={{
                  alignSelf:
                    graphData.first_encounter.first_text[1] === "self"
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                {graphData.first_encounter.first_text[2]}
              </span>
              <span
                className={
                  graphData.first_encounter.second_text[1] === "self"
                    ? "text-self"
                    : "text-other"
                }
              >
                {graphData.first_encounter.second_text[0]}
              </span>
              <span
                className="timestamp"
                style={{
                  alignSelf:
                    graphData.first_encounter.second_text[1] === "self"
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                {graphData.first_encounter.second_text[2]}
              </span>
            </div>
          </div>

          {graphData.monthly_texts && (
            <div className="chart-wrapper" style={{ flex: "2" }}>
              <span className="container-title">Messages per month</span>
              <div className="bubble-chart-container" style={{ height: "90%" }}>
                <LineChart graphData={graphData["monthly_texts"]} />
              </div>
            </div>
          )}
        </div>

        <div className="all-stats">
          <div className="stat">
            <span className="container-title">Top reactions</span>
            <div className="emojis-container">
              <div className="emojis-column">
                {Object.entries(graphData.reaction_type)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([key, value], idx) => {
                    return (
                      <div
                        key={`${key}-${idx}`}
                        className="reaction-item-container"
                      >
                        <div className="emoji-item">{reaction_dict[key]}</div>
                        <div className="emoji-count">
                          {value.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="emojis-column">
                {Object.entries(graphData.reaction_type)
                  .sort((a, b) => b[1] - a[1])
                  .slice(3, 6)
                  .map(([key, value], idx) => {
                    return (
                      <div
                        key={`${key}-${idx}`}
                        className="reaction-item-container"
                      >
                        <div className="emoji-item">{reaction_dict[key]}</div>
                        <div className="emoji-count">
                          {value.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="stat">
            <span className="container-title">Top emojis</span>
            {graphData.all_emojis &&
            Object.keys(graphData.all_emojis).length > 5 ? (
              <div className="emojis-container">
                <div className="emojis-column">
                  {Object.entries(graphData.all_emojis)
                    .sort((a, b) => b[1] - a[1]) // Sort by value (count) in descending order
                    .slice(0, 4)
                    .map(([key, value], idx) => {
                      return (
                        <div
                          key={`${key}-${idx}`}
                          className="emoji-item-container"
                        >
                          <div className="emoji-item">{key}</div>
                          <div className="emoji-count">
                            {value.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="emojis-column">
                  {Object.entries(graphData.all_emojis)
                    .sort((a, b) => b[1] - a[1])
                    .slice(4, 8)
                    .map(([key, value], idx) => {
                      return (
                        <div
                          key={`${key}-${idx}`}
                          className="emoji-item-container"
                        >
                          <div className="emoji-item">{key}</div>
                          <div className="emoji-count">
                            {value.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div>Sorry no messages were found in your file 🫥</div>
            )}
          </div>
          <div className="game-stat">
            <span className="game-title">GamePigeon win rate</span>
            <div className="game-stats">
              <div className="win-rate-container">
                <DoughnutChart
                  chartData={graphData.game_stats.win_loss.wlt}
                  columns={graphData.game_stats.win_loss.columns}
                  nameMap={nameMap}
                />
                <span className="win-rate">
                  {Math.round(
                    (graphData.game_stats.win_loss.wlt[0].num /
                      (graphData.game_stats.win_loss.wlt[0].num +
                        graphData.game_stats.win_loss.wlt[1].num +
                        graphData.game_stats.win_loss.wlt[2].num)) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="ratios">
                <div className="game-ratio">
                  <RatioBar
                    data={Object.entries(graphData.game_stats.games_stat)
                      .sort((a, b) => {
                        const sumA = a[1][0] + a[1][1];
                        const sumB = b[1][0] + b[1][1];
                        return sumB - sumA;
                      })
                      .slice(0, 4)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="personal-row1">
          {graphData.emojis && (
            <div className="chart-wrapper">
              <span className="container-title">Emojis per month</span>
              <div className="bubble-chart-container">
                <LineChart graphData={graphData["emojis"]} />
              </div>
            </div>
          )}

          {graphData.double_text_hr && (
            <div className="chart-wrapper">
              <span className="container-title">{graphName}</span>
              <div className="bubble-chart-container">
                <LineChart
                  trigger={graphState}
                  setTrigger={setGraphState}
                  graphData={bothDoubles}
                />
              </div>
            </div>
          )}
        </div>

        <div className="chart-wrapper">
          <span className="container-title">Messages per hour</span>
          <div className="bubble-chart-container">
            <BubbleChart
              className="day-n-hour"
              chartData={graphData["day_n_hour"]}
            />
          </div>
        </div>
        {graphData.repeat && (
          <div className="chart-wrapper">
            <span className="container-title">Repeated letters per month</span>
            <br></br>
            <span
              className="timestamp"
              style={{ justifyContent: "flex-start", fontSize: "15px" }}
            >
              (eg. "yayyy", "lollllll", "okaayyyyy")
            </span>
            <div className="bubble-chart-container">
              <LineChart graphData={graphData["repeat3"]} />
            </div>
          </div>
        )}

        <div className="personal-row1">
          <div className="chart-wrapper" style={{ flex: "3" }}>
            <span className="container-title sentiment">Your texting mood</span>
            <LineChartSlider graphData={graphData["sentiment_by_date"]} />
          </div>
          <div className="chart-wrapper-cloud" style={{ flex: "2" }}>
            <span className="container-title">Most used words</span>
            {graphData.word_cloud.wordcloud_both &&
            graphData.word_cloud.wordcloud_both.length > 5 &&
            graphData.word_cloud.wordcloud_self &&
            graphData.word_cloud.wordcloud_self.length > 5 &&
            graphData.word_cloud.wordcloud_other &&
            graphData.word_cloud.wordcloud_other.length > 5 ? (
              <div className="word-cloud">
                <WordCloud
                  width={350}
                  height={400}
                  showControls={true}
                  wordList={graphData["word_cloud"]}
                />
              </div>
            ) : (
              <div>Sorry no messages were found in your file 🫥</div>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
);

}

export default PhoneNumber;
//
//<BubbleChart className="day-n-hour" chartData ={graphData['day_n_hour']}/>

/*
        <div className="chart-wrapper">
          <Scats chartData={graphData["time_per_words"]} />
        </div>*/