import { useState, useEffect, createRef, useRef } from "react";
import { ReactSVG } from "react-svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Heading from "../components/Heading";
import Button from "../components/Button";
import BarChart from "../components/BarChart";
import Leaderboard from "../components/Leaderboard";
import LineChart from "../components/LineChart";
import PieChart from "../components/PieChart";
import DoughnutChart from "../components/DoughnutChart";
import { Line, Scatter } from "react-chartjs-2";
import PhoneNumber from "../pages/PhoneNumbers";
import NoPage from "../pages/NoPage";
import WordCloud from "../components/WordCloud";
import ScatterPlot from "../components/ScatterPlot";
import BubbleChart from "../components/BubbleChart";
import RadarChart from "../components/RadarChart";
import Popup from "../components/Popup";
import HashLoader from "react-spinners/HashLoader";
import SliderComponent from "../components/SliderComponent";
import LineChartSlider from "../components/LineChartSlider";
import Carousel from "../components/Carousel";
import RatioBar from "../components/RatioBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/TextronautLogo.svg";
import TimedProgressBar from "../components/TimedProgressBar";
import {
  faHeart,
  faThumbsDown,
  faThumbsUp,
  faQuestion,
  faExclamation,
  faFaceLaugh,
  faVideo,
  faChevronUp,
  faEnvelope,
  faChevronDown,
  faPlus,
  faArrowUp,
  faX,
  faMinus,
  faDownLeftAndUpRightToCenter,
  faRefresh,
  faFolder,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import { text } from "@fortawesome/fontawesome-svg-core";
import Phone from "../components/Phone";
import PreviewDots from "../components/PreviewDots";

//for the problem of having to analyze twice when theres a vcf upload, just run it twice
//have to namemap set false when no file
function Home() {
  const fileInput = createRef();
  const fileInput2 = createRef();

  const [graphData, setGraphData] = useState({});
  const [loading, setLoading] = useState(true);
  const [analyzeLoader, setAnalyzeLoader] = useState(false);
  const [readyCloud, setReadyCloud] = useState(false);
  const [nameMap, setNameMap] = useState(false);
  const [dbFileName, setDbFileName] = useState("");
  const [vcfFileName, setVcfFileName] = useState("");
  const [buttonPopup, setButtonPopup] = useState(true);
  const [seeMore, setSeeMore] = useState(true);
  const [time, setTime] = useState("");
  const [finishedSlides, setFinsishedSlides] = useState(false);
  const [randomTextIndex, setRandomTextIndex] = useState(1);
  const [randomText, setRandomText] = useState();
  const [texterGuess, setTexterGuess] = useState("");
  const [retry, setRetry] = useState(false);
  const [guessCorrect, setGuessCorect] = useState(false);
  const [answer, setAnswer] = useState("");
  const [popupData, setPopupData] = useState();

  const [line1, setLine1] = useState(false);
  const [preview, setPreview] = useState(false);
  const [instructions, setInstructions] = useState(false);
  const [hideInstructions, setHideInsturctions] = useState([true, true, true]);
  const [notification, setNotification] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [waitMessage, setWaitMessage] = useState(
    "Sit tight! This will take around a minute"
  );

  const MAX_FILE_SIZE_MB = 1500;

  let nameOrNumber = "Number";
  if (nameMap) {
    nameOrNumber = "Name";
  }

  const messageRef = useRef();
  const runRandomTimer = async () => {
    await new Promise((resolve) =>
      setTimeout(() => {
        setPreview(true);
        resolve();
      }, 1300)
    );

    // After preview1 shows and disappears we show line 2
    await new Promise((resolve) =>
      setTimeout(() => {
        setLine1(true);
        resolve();
      }, 1800)
    );
  };

  const handleArrowUp = () => {
    if (retry) {
      setRandomTextIndex((prevIndex) => {
        return prevIndex >= graphData.random_text.length - 1
          ? 0
          : prevIndex + 1;
      });
      setGuessCorect("");
      setLine1(false);
      setPreview(false);
      setTexterGuess("");
      setRetry(false);
    } else {
      setTexterGuess(messageRef.current.textContent);

      messageRef.current.textContent = "";
      runRandomTimer();
      setRetry(true);
    }
  };



  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formatted_minutes = minutes >= 10 ? `${minutes}` : `0${minutes}`;
    setTime(`${hours}:${formatted_minutes} ${ampm}`);
  }, [buttonPopup]);
  const override = {
    display: "block",
    margin: "5 auto",
    borderColor: "red",
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Return") {
      event.preventDefault(); // Prevents the default behavior of adding a line break
      handleArrowUp();
    }
  };
  let morning = ["", ""];
  let afternoon = ["", ""];
  let night = ["", ""];
  let number1 = ["", ""];
  let total_texts = null;
  let num_contact;
  let total_minutes;
  let total_days;
  let top5;
  let random_text_df;
  let popupResult;
  let rotationAngle = "0deg";

  if (!loading) {
    morning = graphData["recap_stats"]["morning"];
    afternoon = graphData["recap_stats"]["afternoon"];
    night = graphData["recap_stats"]["night"];
    number1 = graphData["recap_stats"]["number1"];
    total_texts = graphData["recap_stats"]["total_texts"];
    total_minutes = Math.round(total_texts / 36);
    total_days =
      total_minutes > 720
        ? ` or ${(total_minutes / 1440).toFixed(2)} days`
        : "";
    random_text_df = graphData.random_text;
    num_contact = graphData["recap_stats"]["num_contact"];
    top5 = (
      <ul>
        {graphData["recap_stats"]["top5_words"].map((word, index) => (
          <li key={word}>
            {word.text}: {word.value}
          </li>
        ))}
      </ul>
    );
    /*
    popupResult = Popup({
      trigger: buttonPopup,
      isFinished: finishedSlides,
      loading: loading,
      graphData: graphData,
      setTrigger: setButtonPopup,
      nameMap: nameMap,
      children: overallStats,
    });
    */
  }

  const overallStats = [
    <div className="page1">
      <div className="top-bar">
        <div className="top-top-bar">
          <div className="back">
            <FontAwesomeIcon className="back-button" icon={faChevronUp} />
            <span className="back-bubble">176</span>
          </div>

          <div className="contact-container">
            <div className="contact">circle</div>
          </div>

          <div className="facetime-container">
            <FontAwesomeIcon className="facetime" icon={faVideo} />
          </div>
        </div>
        <div className="contact-name">Textualize</div>
      </div>
      <div className="texts">
        <div className="timestamp">Today {time}</div>
        <span className="text-other">Your Texting Wrapped is here</span>
        <br></br>
        <span className="text-other">And ...!</span>
      </div>
      <div className="message-bar"></div>
    </div>,
  ];

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

  const [statsIndex, setStatsIndex] = useState(0);

  const handleDbFileChange = () => {
    if (fileInput.current.files.length > 0) {
      const file = fileInput.current.files[0];
      const fileSizeInMB = file.size / (1024 * 1024);

      if (fileSizeInMB > MAX_FILE_SIZE_MB) {
        alert(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB.`);
        // Reset the file input
        fileInput.current.value = "";
        setDbFileName("");
        setFileSize(0);
        return;
      }

      setDbFileName(file.name);
      if (fileSizeInMB * 0.35 > 120) {
        setFileSize(fileSizeInMB * 650);
        setWaitMessage(
          "Your file is quite large, this will take a few minutes..."
        );
      } else {
        setFileSize(fileSizeInMB * 450);
      }
    }
  };
  const handleVcfFileChange = () => {
    if (fileInput2.current.files.length > 0) {
      setVcfFileName(fileInput2.current.files[0].name);
    }
    //else{setNameMap(false)}
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (fileInput.current.files[0]) {
      formData.append("messages", fileInput.current.files[0]);
    } else {
      alert("Please upload your messages");
      return;
    }

    if (fileInput2.current.files[0]) {
      formData.append("contacts", fileInput2.current.files[0]);
      setNameMap(true);
    } else {
      setNameMap(false);
    }

    setNotification(true);
    setTimeout(() => setNotification(false), 10000);

    try {
      setAnalyzeLoader(true);
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        fetchGraphData();
      } else {
        console.error("An error has occurred:", data.messages_message);
        setAnalyzeLoader(false);
      }
    } catch (e) {
      console.error(e.message);
      setAnalyzeLoader(false);
    }
  };

  useEffect(() => {
    if (
      graphData &&
      graphData.leaderboard &&
      graphData.day_of_week_texts &&
      graphData.monthly_texts
    ) {
      setLoading(false);
    }
  }, [graphData]);

  const fetchGraphData = async () => {
    const options = {
      method: "GET",
      headers: { "Access-Control-Allow-Origin": "*" },
    };
    try {
      const response = await fetch("http://127.0.0.1:5000/", options);
      const data = await response.json();
      console.log("fetching graph data was a success");
      setGraphData(data);
    } catch (error) {
      console.error(error);
    }
    setAnalyzeLoader(false);
  };

  const fetchPopupData = async () => {
    const options = {
      method: "GET",
      //headers: { 'Access-Control-Allow-Origin': '*', },
    };
    try {
      const response = await fetch("http://127.0.0.1:5000/popup", options);
      const data = await response.json();
      setPopupData(data);
      console.log("fetching popup data was a success");
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInstructions = () => {
    setInstructions(!instructions);
  };

  if (loading) {
    return (
      <>
        <div className="loading-home">
          <Navbar></Navbar>
          <div className="home-title">
            <h1>
              <span className="site-title site-title-home">
                Welcome to Textronaut
              </span>
            </h1>
            <span className="title-description">
              Your personalized text message analysis tool
            </span>
          </div>

          <form className="upload-container" onSubmit={onSubmit}>
            <button
              onClick={handleInstructions}
              className="actual-btn instruction"
            >
              Get Started
            </button>
            <div className={instructions ? "popup" : "hidden"}>
              <div className="instructions-popup-inner">
                <div className="window-top-bar">
                  <div
                    onClick={() => setInstructions(false)}
                    className="red circle"
                  />

                  <div
                    onClick={() => setInstructions(false)}
                    className="orange circle"
                  />
                  <div
                    onClick={() => setInstructions(false)}
                    className="green circle"
                  />
                </div>
                <div className="window-body">
                  <div className="window-title">What is this?</div>
                  <div className="window-instructions">
                    <div className="window-instruction">
                      <div className="window-instruction-title">
                        This is a text message analyzing website. You upload
                        your texts and we'll analyze it for you!
                      </div>
                    </div>
                    <div className="window-instruction">
                      <div className="window-instruction-title">
                        Nothing will be saved. All of your files will be deleted
                        immediately once you exit the site!
                      </div>
                    </div>
                    <div className="window-instruction">
                      <div className="window-instruction-title">
                        To get started check out the following ⬇️
                      </div>
                    </div>
                  </div>
                  <div className="window-title">
                    Where do I find my messages?
                    <br />
                    <span style={{ fontSize: "15px" }} className="timestamp">
                      (only for iPhones at the moment)
                    </span>
                  </div>
                  <div
                    style={{ topMargin: "0px" }}
                    className="window-instructions"
                  >
                    <div
                      className="window-instruction"
                      onClick={() => {
                        setHideInsturctions((prevHide) => {
                          const temp = [...prevHide];
                          temp[0] = !prevHide[0];
                          return temp;
                        });
                      }}
                    >
                      <div className="window-instruction-title">
                        For Mac and iPhone Users
                        <FontAwesomeIcon
                          icon={
                            hideInstructions[0] ? faChevronDown : faChevronUp
                          }
                        />
                      </div>
                      <ol
                        className={
                          hideInstructions[0] ? "hidden" : "step-instruction"
                        }
                      >
                        <li>
                          On your Mac, open up Finder and press{" "}
                          <b>command + shift + g</b> to open up your file search
                          bar
                        </li>
                        <li>
                          Copy and paste the following into the search bar "
                          <b>/Users/(YourUsername)/Library/Messages/chat.db</b>"
                        </li>
                        <li>
                          Locate your "<b>chat.db</b>" file (ignore the ones
                          that end with "-wal" or "-shm") and upload here!
                        </li>
                        <li>
                          <b>
                            *IMPORTANT* It must be a chat.db file or this will
                            not work!
                          </b>
                        </li>
                      </ol>
                    </div>
                    <div
                      className="window-instruction "
                      onClick={() => {
                        setHideInsturctions((prevHide) => {
                          const temp = [...prevHide];
                          temp[1] = !prevHide[1];
                          return temp;
                        });
                      }}
                    >
                      <div className="window-instruction-title">
                        For iPhone Users Only
                        <FontAwesomeIcon
                          icon={
                            hideInstructions[1] ? faChevronDown : faChevronUp
                          }
                        />
                      </div>
                      <ol
                        className={
                          hideInstructions[1] ? "hidden" : "step-instruction"
                        }
                      >
                        <li>Connect your iPhone to Mac via Finder</li>
                        <li>
                          Create a backup: <br></br> - Select your iPhone in
                          Finder
                          <br></br> - Click "Back Up Now" in Backups section
                        </li>
                        <li>
                          Once finished, access your backup file by opening
                          Finder and press <b>command + shift + g</b> to open up
                          your file search bar
                        </li>
                        <li>
                          Copy and paste the following into the search bar "
                          <b>
                            /Users/(YourUsername)/Library/ApplicationSupport/MobileSync/Backup/
                          </b>
                          "
                        </li>
                        <li>
                          Then navigate through /(BackupName)/3d to finally find
                          a file named "
                          <b>3d0d7e5fb2ce288813306e4d4636395e047a3d28</b>"
                          <br></br>
                        </li>
                        <li>
                          Finally, right click and rename it to "chat.db" and
                          upload here!
                        </li>
                        <li>
                          <b>
                            *IMPORTANT* It must be a chat.db file or this will
                            not work!
                          </b>
                        </li>
                      </ol>
                    </div>
                  </div>
                  <div className="window-title">
                    Where do I find my contacts?
                    <span style={{ fontSize: "15px" }} className="timestamp">
                      (Last step, almost there!)
                    </span>
                  </div>
                  <div
                    style={{ topMargin: "0px" }}
                    className="window-instructions"
                  >
                    <div
                      className="window-instruction"
                      onClick={() => {
                        setHideInsturctions((prevHide) => {
                          const temp = [...prevHide];
                          temp[2] = !prevHide[2];
                          return temp;
                        });
                      }}
                    >
                      <div className="window-instruction-title">
                        Exporting Contacts
                        <FontAwesomeIcon
                          icon={
                            hideInstructions[2] ? faChevronDown : faChevronUp
                          }
                        />
                      </div>
                      <ol
                        className={
                          hideInstructions[2] ? "hidden" : "step-instruction"
                        }
                      >
                        <li>Open the Contacts app on your iPhone</li>
                        <li>
                          Tap 'Lists' at the top and <b>hold </b>'All Contacts'
                        </li>
                        <li>
                          Tap the 'Share' button and chose Export (no need to
                          "Select All Fields" the default ones are fine)
                        </li>
                        <li>Finally click done to download and upload here!</li>
                        <li>
                          <b>
                            *IMPORTANT* The contacts file must end with a .vcf
                            to work!
                          </b>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="upload-files-container">
              <input
                type="file"
                accept=".db"
                onChange={handleDbFileChange}
                required
                className="hidden-btn"
                id="actual-btn"
                ref={fileInput}
                hidden
              />
              <div className="upload-file-container">
                <label htmlFor="actual-btn" className="actual-btn">
                  Upload chat file
                </label>
                <span className={dbFileName ? "file-name" : "transparent"}>
                  {dbFileName ? dbFileName : "space"}
                </span>
              </div>
              <input
                type="file"
                accept=".vcf"
                onChange={handleVcfFileChange}
                className="hidden-btn"
                id="other-btn"
                ref={fileInput2}
                hidden
              />
              <div className="upload-file-container">
                <label htmlFor="other-btn" className="actual-btn">
                  Upload contacts file
                </label>
                <span className={vcfFileName ? "file-name" : "transparent"}>
                  {vcfFileName}
                </span>
              </div>
            </div>

            <input
              type="submit"
              className="analyze-btn"
              value={"Analyze Now"}
            ></input>
          </form>
          {notification && (
            <div className="copy-notification" style={{ fontSize: "18px" }}>
              {waitMessage}
            </div>
          )}
          {analyzeLoader && (
            <div style={{ width: "50%", margin: "auto", marginTop: "3%" }}>
              <TimedProgressBar duration={fileSize} />
            </div>
          )}
        </div>
        <footer className="home-footer">
          <div className="footer-content">
            <p>&copy; 2024 Textualize. All rights reserved.</p>
            <nav className="footer-links">
              <a href="mailto:tommytan@ucla.edu">
                Contact <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </nav>
          </div>
        </footer>
      </>
    );
  }
  return (
    <>
      <Navbar />

      <div className="background">
        <ReactSVG className="logo" src={logo} />
        <Popup
          trigger={buttonPopup}
          isFinished={finishedSlides}
          loading={loading}
          graphData={graphData}
          setTrigger={setButtonPopup}
          statsIndex={statsIndex}
          setStatsIndex={setStatsIndex}
          length={overallStats.length}
          nameMap={nameMap}
        >
          {overallStats}
        </Popup>

        <div className="container-charts">
          <div className="grid-container">
            <div className="grid-phone-container">
              <div
                className="phone-container grid-phone"
                onClick={() => {
                  setButtonPopup(true);
                  setFinsishedSlides(true);
                }}
              >
                <Phone
                  trigger={buttonPopup}
                  loading={loading}
                  isFinished={finishedSlides}
                  graphData={graphData}
                  setTrigger={setButtonPopup}
                  statsIndex={statsIndex}
                  setStatsIndex={setStatsIndex}
                  length={overallStats.length}
                  nameMap={nameMap}
                />
              </div>

              <div
                className={
                  windowWidth > 1046 ? "hidden" : "chart-wrapper grid-linechart"
                }
              >
                <span className="container-title">Messages per month</span>
                <div
                  className={
                    windowWidth > 760
                      ? "bubble-chart-container-scaled"
                      : "bubble-chart-container-scaled2"
                  }
                >
                  <LineChart graphData={graphData["monthly_texts"]} />
                </div>
              </div>
            </div>
            <div className="grid-chart-container">
              <div
                className={
                  windowWidth > 1046 ? "chart-wrapper grid-linechart" : "hidden"
                }
              >
                <span className="container-title">Messages per month</span>
                <div className="line-chart-container">
                  <LineChart graphData={graphData["monthly_texts"]} />
                </div>
              </div>
              <div className="grid-chart-stacked-container">
                <div className="chart-wrapper grid-bubblechart">
                  <span className="container-title">Messages per hour</span>
                  <div className="bubble-chart-container">
                    <BubbleChart
                      className="day-n-hour"
                      chartData={graphData["day_n_hour"]}
                    />
                  </div>
                </div>
                <div className="chart-wrapper grid-barchart">
                  <span className="container-title">Messages per day</span>
                  <div className="bubble-chart-container">
                    <BarChart
                      chartData={graphData["day_of_week_texts"]["chartData"]}
                      columns={graphData["day_of_week_texts"]["columns"]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="all-stats">
            <div className="row1">
              <div className="chart-wrapper-cloud">
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
              <div className="chart-wrapper guess-wrapper">
                <span className="container-title">Guess the texter</span>
                {graphData.random_text && graphData.random_text.length > 0 ? (
                  <div className="guess-container">
                    <div className="guess-text-container">
                      <span className="text-other guess-text">
                        Who said this: "
                        {graphData.random_text[randomTextIndex]["Message"]}"
                        <br />
                      </span>
                      <div className="guess-self">
                        <span
                          className={
                            texterGuess === "" ? "hidden" : "text-self"
                          }
                        >
                          {texterGuess}
                          <br />
                        </span>
                      </div>
                      <div className={preview ? "fadeout" : "hidden"}>
                        <PreviewDots />
                      </div>
                      <span
                        className={
                          line1 ? "text-other fadein" : "text-other hidden"
                        }
                      >
                        {!loading &&
                        graphData.random_text?.[randomTextIndex]?.[
                          nameOrNumber
                        ] &&
                        texterGuess != "" &&
                        (texterGuess.toLowerCase() ===
                          graphData.random_text[randomTextIndex][
                            nameOrNumber
                          ] ||
                          graphData.random_text[randomTextIndex][nameOrNumber]
                            .toLowerCase()
                            .startsWith(texterGuess.toLowerCase()))
                          ? `✅ Correct it was ${graphData.random_text[randomTextIndex][nameOrNumber]}`
                          : `❌ WRONG It was ${graphData.random_text[randomTextIndex][nameOrNumber]}`}
                      </span>
                    </div>
                    <div className="home-message-bar">
                      <FontAwesomeIcon className="plus" icon={faPlus} />
                      <div className="message-container">
                        <div
                          className="custom-input"
                          ref={messageRef}
                          contentEditable="true"
                          onKeyDown={handleKeyDown}
                        ></div>
                        <FontAwesomeIcon
                          className="arrowup"
                          onClick={handleArrowUp}
                          icon={retry ? faRefresh : faArrowUp}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>Sorry no messages were found in your file 🫥</div>
                )}
              </div>
              <div className="leaderboard-container">
                <span className="container-title">Message leaderboard</span>
                <span
                  className="timestamp"
                  style={{ justifyContent: "flex-start", fontSize: "11.7px" }}
                >
                  (Click on each name for individual analysis)
                </span>
                <Leaderboard
                  data={graphData["leaderboard"]["chartData"]}
                  nameMap={nameMap}
                  width={windowWidth}
                  link={true}
                ></Leaderboard>
              </div>
            </div>
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
              <span className="game-title">GamePigeon winrate</span>
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
                  <div className="game-ratio">
                    <RatioBar
                      data={Object.entries(graphData.game_stats.games_stat)
                        .sort((a, b) => {
                          const sumA = a[1][0] + a[1][1];
                          const sumB = b[1][0] + b[1][1];
                          return sumB - sumA;
                        })
                        .slice(4, 8)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="all-stats">
            <div className="overall-stats">
              <div className="chart-wrapper sentiment-linechart-wrapper">
                <span className="container-title sentiment">
                  Your texting mood
                </span>
                <LineChartSlider graphData={graphData["sentiment_by_date"]} />
              </div>
            </div>
          </div>
        </div>
        <footer className="home-footer">
          <div className="footer-content">
            <p>&copy; 2024 Textualize. All rights reserved.</p>
            <nav className="footer-links">
              <a href="mailto:tommytan@ucla.edu">
                Send Email <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;
