import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/TextronautLogo.svg";
import html2canvas from "html2canvas";
import domtoimage from "dom-to-image";
import { ReactSVG } from "react-svg";
import {
  faPlus,
  faVideo,
  faChevronUp,
  faChevronLeft,
  faArrowUp,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import PreviewDots from "./PreviewDots";
import Typical from "react-typical";
import RatioBar from "./RatioBar";
function Popup(props) {
  const [time, setTime] = useState("");

  const [index, setIndex] = useState(0);

  const timeOuts = [];
  const [preview, setPreview] = useState(false);
  const [preview2, setPreview2] = useState(false);
  const [preview3, setPreview3] = useState(false);
  const [preview4, setPreview4] = useState(false);

  const [line1, setLine1] = useState(false);
  const [line2, setLine2] = useState(false);
  const [line3, setLine3] = useState(false);
  const [line4, setLine4] = useState(false);
  const [line5, setLine5] = useState(false);

  const [slideDone, setSlideDone] = useState(false);
  const [finished, setFinsished] = useState(false);
  const [transition, setTransition] = useState(false);
  const [sent, setSent] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [isCorrect, setIsCorrect] = useState("");
  const [lastMessage, setLastMessage] = useState(false);
  const [lastMessagePreview, setLastMessagePreview] = useState(false);

  const [copying, setCopying] = useState(false);
  const [notification, setNotification] = useState(false);
  const [showSelfMessage, setShowSelfMessage] = useState(false);
  const [selfMessage, setSelfMessage] = useState([
    "Yes!",
    "How much did I text?",
    "Who was I texting?",
    "What were my favorite words?",
    "Thats cool!",
    "lala",
    "Share your Text Life --------->",
    "share my texting personality!",
  ]);

  const messageEndRef = useRef(null);
  const [spaceHolderHeight, setSpaceHolderHeight] = useState("940px");
  const textsRef = useRef(null);
  const messageRef = useRef(null);
  // Optional: Apply CSS scaling for high DPI screens
  const node = document.getElementById("component-to-download");

  const waitForIcons = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const iconLoaded = document.querySelector(".fa"); // Check for any FontAwesome icon
        if (iconLoaded) {
          clearInterval(interval);
          resolve();
        }
      }, 100); // Check every 100ms
    });
  };

  const copyImageToClipboard = async () => {
    // First option: Using dom-to-image with toPng
    await document.fonts.ready;
    //console.log("font is ready!");
    //await waitForIcons();
    html2canvas(node, { scale: 8, useCORS: true, allowTaint: true })
      .then((canvas) => {
        canvas.toBlob((blob) => {
          navigator.clipboard
            .write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ])
            .catch((err) => {
              console.error("Failed to copy image: ", err);
            });
        });
      })
      .catch((err) => {
        console.error("Error generating image: ", err);
      });

    // Alternative option: Using html2canvas
  };

  let userGuess = "";

  let morning = ["", ""];
  let afternoon = ["", ""];
  let night = ["", ""];
  let number1 = ["", ""];
  let total_texts = null;
  let num_contact;
  let total_minutes;
  let total_days;
  let top5;
  let top5texters;
  let numTopText;
  let line1s;
  let winrate;
  let total;
  let percentage;
  let wins;
  let losses;
  let draws;
  let max_day;
  let emojis;
  let firstEmoji;
  let top_word;
  let peak_period;
  let top_chatter;
  let random_text;
  let unique_word_count;

  if (!props.loading) {
    morning = props.graphData["recap_stats"]["morning"];
    afternoon = props.graphData["recap_stats"]["afternoon"];
    night = props.graphData["recap_stats"]["night"];
    number1 = props.graphData["recap_stats"]["number1"];
    total_texts = props.graphData["recap_stats"]["total_texts"];
    total_minutes = Math.round(total_texts / 36);
    total_days =
      total_minutes > 720
        ? ` ${(total_minutes / 1440).toFixed(2)} days`
        : "";
    num_contact = props.graphData["recap_stats"]["num_contact"];
    winrate = props.graphData.game_stats.win_loss.wlt;
    total = winrate[0]["num"] + winrate[1]["num"] + winrate[2]["num"];
    wins = winrate[0]["num"];
    losses = winrate[1]["num"];
    draws = winrate[2]["num"];
    if (props.graphData.random_text && props.graphData.random_text.length > 0) {
      random_text = props.graphData.random_text[0];
    } 
    peak_period = props.graphData.recap_stats.peak_period;
    unique_word_count = props.graphData.unique_word_count;
    if (props.nameMap) {
      top_chatter = props.graphData.leaderboard.chartData[0].name;
    } else {
      top_chatter = props.graphData.leaderboard.chartData[0].index;
    }

    if (top_chatter.length > 12) {
      top_chatter = String(top_chatter).substring(0, 12) + "...";
    }


    percentage = Math.round((winrate[0]["num"] / total) * 100);
    max_day = props.graphData["day_of_week_texts"]["chartData"].reduce(
      (max, data) => {
        return data.Myself > max.value
          ? { value: data.Myself, index: data.index }
          : max;
      },
      { value: -Infinity, index: "" }
    );
    if (
      props.graphData.all_emojis &&
      Object.keys(props.graphData.all_emojis).length > 5
    ) {
      emojis = Object.entries(props.graphData.all_emojis)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key, value], idx) => {
          return <span key={idx}>{key}</span>;
        });
    } else {
      emojis = "🫥";
    }
   
    const topEmoji = Object.entries(props.graphData.all_emojis).sort(
      (a, b) => b[1] - a[1]
    )[0];
    firstEmoji =
      topEmoji && topEmoji.length > 0 ? (
        <span>
          {topEmoji[0]} ({topEmoji[1].toLocaleString()} times)
        </span>
      ) : (
        <span>... oops sorry no messages were found in your file 🫥</span>
      );
    if (
      props.graphData.word_cloud.wordcloud_self && props.graphData.word_cloud
        .wordcloud_self.length > 0
    ) {
      top_word = props.graphData.word_cloud.wordcloud_self[0]["text"];
      top5 = (
        <ol>
          {props.graphData["recap_stats"]["top5_words"].map((word, index) => (
            <li key={index}>
              {word.text}: {word.value.toLocaleString()}
            </li>
          ))}
        </ol>
      );
    } else {
      top_word = "";
      top5 = "Sorry no messages were found in your file 🫥";
    }
    const tempNumOne = Object.entries(props.graphData.leaderboard.chartData[0]);
    numTopText = tempNumOne[1][1];
    if (props.nameMap) {
      top5texters = (
        <ol>
          {props.graphData["leaderboard"]["chartData"]
            .slice(0, 5)
            .map((word, index) => (
              <li key={index}>
                {word.name}: {word.messages.toLocaleString()}
              </li>
            ))}
        </ol>
      );
    } else {
      top5texters = (
        <ol>
          {props.graphData["leaderboard"]["chartData"]
            .slice(0, 5)
            .map((word, index) => (
              <li key={index}>
                {word.index}: {word.messages.toLocaleString()}
              </li>
            ))}
        </ol>
      );
    }

    line1s = [
      <div className="text-screen">
        <div className="timestamp">Today {time}</div>
        <span className="text-other">
          🌅 From dawn to dusk, you were a texting machine with {number1[1]}! 🤖
        </span>
      </div>,
      <div className="text-screen">
        <div className="timestamp">Today {time}</div>
        <span className="text-other">
          🎉 Drumroll please... You've sent a jaw-dropping{" "}
          {total_texts.toLocaleString()} messages in total! <br />
        </span>
      </div>,
      <div className="text-screen">
        <div className="timestamp">Today {time}</div>
        <span className="text-other">
          🏆 Your texting BFF was {number1[1]} with a whopping{" "}
          {numTopText.toLocaleString()} messages!
          <br />
        </span>
      </div>,
      <div className="text-screen">
        <div className="timestamp">Today {time}</div>
        <span className="text-other">
          📚 You're a walking dictionary with{" "}
          {unique_word_count.toLocaleString()} unique words used!
          <br />
        </span>
      </div>,
      <div className="">
        <div className="timestamp">Today {time}</div>
        <span className="text-other">How well do you know your friends?</span>
      </div>,
      <div className="last-page">
        <div className="timestamp">Today {time}</div>
        <span className="text-other share">
          <div className="stat-box">
            <div className="stat-box-messages">
              <div className="stat-box-bot">Total Messages</div>
              <div className="stat-box-top emoji">💬</div>
              <div className="stat-box-mid">{total_texts.toLocaleString()}</div>
            </div>
            <div className="stat-box-emojis">
              <div className="stat-box-bot">Top Emojis</div>
              <div className="stat-box-top emoji">🏆</div>
              <div className="stat-box-mid">{emojis}</div>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-box-messages">
              <div className="stat-box-bot">Top Texter</div>
              <div className="stat-box-top emoji">👥</div>
              <div className="stat-box-mid">{top_chatter}</div>
            </div>
            <div className="stat-box-emojis">
              <div className="stat-box-bot">Peak Activity</div>
              <div className="stat-box-top emoji">{peak_period[2]}</div>
              <div className="stat-box-mid">{peak_period[1]}</div>
            </div>
          </div>
        </span>
        <div className="text-other share stat-box game-box">
          <div>GamePigeon Win Rate</div>
          <RatioBar data={winrate} one={true} />
          <div>
            {percentage}% ({wins}W {losses}L {draws}T)
          </div>
        </div>
        <span className="text-other share last-text-other">
          <div className="stat-box">
            <div className="stat-box-messages">
              <div className="stat-box-bot">Most Active Day</div>
              <div className="stat-box-top emoji">📅</div>
              <div className="stat-box-mid">{props.graphData.most_active_day}</div>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-box-messages">
              <div className="stat-box-bot">Favorite Word</div>
              <div className="stat-box-top emoji">🔠</div>
              <div className="stat-box-mid">{top_word}</div>
            </div>
          </div>
        </span>
        <span className={showSelfMessage ? "text-self" : "hidden"}>
          {selfMessage[index]}
        </span>{" "}
      </div>,
    ];
  }

  const delay = (ms) => {
    return new Promise((resolve) => {
      const timeOutId = setTimeout(resolve, ms);
      timeOuts.push(timeOutId);
    });
  };

  const clearAllTimeouts = () => {


    timeOuts.forEach((timeOutId) => clearTimeout(timeOutId));
    timeOuts.length = 0;
  };

  const runTimers = async () => {
    if (finished) {
      return;
    } else if (index == slides.length - 1) {
      setSlideDone(true);
    } else if (index == 0) {
      await delay(800);
      setLine1(true);

      await delay(1300);
      setPreview(true);

      await delay(1800);
      setLine2(true);

      await delay(1500);
      setSlideDone(true);
    } else if (index == 1) {
      //delay for first text

      // First timer
      await delay(2000);
      setPreview(true);

      await delay(1800);
      setLine2(true);

      await delay(1500);
      setPreview2(true);

      await delay(1800);
      setLine3(true);

      await delay(1500);
      setPreview3(true);

      await delay(1800);
      setLine4(true);

      await delay(2000);
      setSlideDone(true);
    } else if (index == 2 || index == 3 || index == 4) {
      await delay(2200);
      setPreview(true);
      await delay(1800);
      setLine2(true);
      await delay(1500);
      setPreview2(true);
      await delay(1800);
      setLine3(true);
      await delay(2000);
      setSlideDone(true);
    } else if (index == slides.length - 2) {
      await delay(2300);
      setPreview(true);
      await delay(1800);
      setLine2(true);
      await delay(1500);
      setPreview2(true);
      await delay(1800);
      setLine3(true);
      await delay(1500);
      setPreview3(true);
      await delay(1500);
      setLine4(true);
      setSlideDone(true);
    }
    clearAllTimeouts();
  };

  useEffect(() => {
    setSent(false);
    setLastMessage(false);
    setLastMessagePreview(false);
    setCorrect(false);
    setSlideDone(false);
    setShowSelfMessage(false);
    setLine1(false);
    setLine2(false);
    setLine3(false);
    setLine4(false);
    setLine5(false);
    setPreview(false);
    setPreview2(false);
    setPreview3(false);
    setPreview4(false);
    runTimers();

    if (index == slides.length - 1) {
      setFinsished(true);
      setCopying(true);
      setSlideDone(true);
      setIndex(slides.length - 1);
    }
  }, [index, props.trigger]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [
    line1,
    line2,
    line3,
    line4,
    line5,
    preview,
    preview2,
    preview3,
    preview4,
    showSelfMessage,
    isCorrect,
    transition,
    lastMessage,
    lastMessagePreview,
  ]);

  useEffect(() => {
    if (textsRef.current) {
      const height = textsRef.current.clientHeight;

      if (height < 300) {
        setSpaceHolderHeight("1240px");
      }
    }
  }, [transition]);
  useEffect(() => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formatted_minutes = minutes >= 10 ? `${minutes}` : `0${minutes}`;
    setTime(`${hours}:${formatted_minutes} ${ampm}`);
  }, []);

  useEffect(() => {
    if (slides.length - 1 == index) {
      setFinsished(true);
      setSlideDone(true);
    }
  }, [sent]);
  const handleArrowUp = async () => {
    if (index >= slides.length - 1) {
      setFinsished(true);
      setCopying(true);
      copyImageToClipboard();
      setNotification(true);
      await delay(3500);
      setNotification(false);
      return;
    }
    else if (index == slides.length - 2) {
      setShowSelfMessage(true);
      const temp = messageRef.current.textContent;
      
      userGuess = temp;
      messageRef.current.textContent = "";
      setSelfMessage((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[slides.length - 2] = temp;
        return updatedMessages;
      });
      let tempIndex = "Number";
      if (props.nameMap) {
        tempIndex = "Name";
      }
      if(userGuess != "" && random_text){
        if (
          (random_text && 
            userGuess.toLowerCase() == random_text[tempIndex].toLowerCase()) ||
          random_text[tempIndex].toLowerCase().startsWith(userGuess.toLowerCase())
        ) {
          setIsCorrect(
            `✅ Correct! It was ${random_text[tempIndex]}. Now let's check out your final stats!`
          );
        } 
        else{
          setIsCorrect(
            `❌ Ehhh, wronggg! It was ${random_text[tempIndex]}. Now let's check out your final stats!`
          );
        }
      }
      else if(random_text && userGuess == "")
      {
        setIsCorrect(
          `❌ Ehhh, wronggg! It was ${random_text[tempIndex]}. Now let's check out your final stats!`
        );
      }
      else{
        setIsCorrect(
          "But we did find your other stats, now let's check it out!"
        );
      }


      setCorrect(true);
      await new Promise((resolve) =>
        setTimeout(() => {
          setLastMessagePreview(true);
          resolve();
        }, 1800)
      );
      await new Promise((resolve) =>
        setTimeout(() => {
          setLastMessage(true);
          resolve();
        }, 2000)
      );
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, 2000)
      );
    }
    if (slideDone && !finished && index < slides.length - 1) {
      if (index >= slides.length - 1) {
        setIndex(index);
      } else {
        setSent(true);
        setShowSelfMessage(true);

        await new Promise((resolve) =>
          setTimeout(() => {
            setShowSelfMessage(false);

            resolve();
          }, 1000)
        );

        setTransition(true);
        await new Promise((resolve) =>
          setTimeout(() => {
            setIndex((i) => i + 1);
            resolve();
          }, 1800)
        );

        setTransition(false);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Return") {
      event.preventDefault(); // Prevents the default behavior of adding a line break
      handleArrowUp();
    }
  };

  let slides = [
    <div>
      <div className="timestamp">Today {time}</div>
      <span className="text-other line1">
        📱 Your Texting Wrapped is here!
      </span>{" "}
      <br></br>
      <div className={preview ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line2 ? "text-other fadein" : "text-other hidden"}>
        Ready for the juicy details?
      </span>{" "}
      <br></br>
      <div className="guess-self">
        <span className={showSelfMessage ? "text-self" : "hidden"}>
          {selfMessage[index]}
        </span>
      </div>
    </div>,
    <div>
      <div className="timestamp">Today {time}</div>
      <span className="text-other">
        🌅 From dawn to dusk, you were a texting machine with {number1[1]}! 🤖
      </span>
      <div className={preview ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line2 ? "text-other fadein" : "text-other hidden"}>
        ☀️ Your day kicked off with {morning[1]} morning texts<br></br>
      </span>
      <div className={preview2 ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line3 ? "text-other fadein" : "text-other hidden"}>
        🌞 You conquered the afternoon with {afternoon[1]} messages <br></br>
      </span>
      <div className={preview3 ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line4 ? "text-other fadein" : "text-other hidden"}>
        🌙 And wrapped up with {night[1]} night owl texts <br></br>
      </span>
      <div className="guess-self">
        <span className={showSelfMessage ? "text-self" : "hidden"}>
          {selfMessage[index]}
        </span>
      </div>
    </div>,
    <div>
      <div className="timestamp">Today {time}</div>
      <span className="text-other">
        🎉 Drumroll please... You've sent a jaw-dropping{" "}
        {total_texts.toLocaleString()} messages in total! <br />
      </span>
      <div className={preview ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line2 ? "text-other fadein" : "text-other hidden"}>
        ⏰ That's roughly {total_minutes.toLocaleString()} minutes or{" "}
        {total_days.toLocaleString()} of non-stop texting😱.<br></br>
      </span>
      <div className={preview2 ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line3 ? "text-other fadein" : "text-other hidden"}>
        Your fingers were on 🔥fire🔥 at {peak_period[1]} for a total of{" "}
        {peak_period[3].toLocaleString()} texts!
      </span>
      <div />
      <div className="guess-self">
        <span className={showSelfMessage ? "text-self" : "hidden"}>
          {selfMessage[index]}
        </span>
      </div>
    </div>,
    <div>
      <div className="timestamp">Today {time}</div>
      <span className="text-other">
        🏆 Your texting BFF was {number1[1]} with a whopping{" "}
        {numTopText.toLocaleString()} messages!
      </span>
      <div className={preview ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line2 ? "text-other fadein" : "text-other hidden"}>
        🌟 Your top 5 texting buddies were:<br></br>
      </span>
      <div className={preview2 ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line3 ? "text-other fadein" : "text-other hidden"}>
        {top5texters} <br></br>
      </span>
      <div className="guess-self">
        <span className={showSelfMessage ? "text-self" : "hidden"}>
          {selfMessage[index]}
        </span>
      </div>
    </div>,
    <div>
      <div className="timestamp">Today {time}</div>
      <span className="text-other">
        📚 You're a walking dictionary with {unique_word_count.toLocaleString()}{" "}
        unique words used! <br />
      </span>
      <div className={preview ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line2 ? "text-other fadein" : "text-other hidden"}>
        Your top 5 most used words were:
        {top5}
      </span>
      <div className={preview2 ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line3 ? "text-other fadein" : "text-other hidden"}>
        And your emoji of choice? The one and only {firstEmoji}!<br></br>
      </span>
      <div className="guess-self">
        <span className={showSelfMessage ? "text-self" : "hidden"}>
          {selfMessage[index]}
        </span>
      </div>
    </div>,

    <div>
      <div className="timestamp">Today {time}</div>
      <span className="text-other">How well do you know your friends?</span>
      <div className={preview ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line2 ? "text-other fadein" : "text-other hidden"}>
        We're talking 3 AM, texting with no lights on! <br></br>
      </span>
      <div className={preview2 ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line3 ? "text-other fadein" : "text-other hidden"}>
        Let's play guess the texter. I give you a text and you guess who
        sent it.<br></br>
      </span>
      <div className={preview3 ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={line4 ? "text-other fadein" : "text-other hidden"}>
        "
        {random_text
          ? random_text["Message"]
          : "Oops no messages were found in your file 🫥. Press the arrow to continue"}
        " <br></br>
      </span>
      <div />
      <div className="guess-self">
        <span className={showSelfMessage ? "text-self" : "hidden"}>
          {selfMessage[index]}
        </span>
      </div>

      <div className={lastMessagePreview ? "fadeout" : "hidden"}>
        <PreviewDots />
      </div>
      <span className={lastMessage ? "text-other fadein" : "text-other hidden"}>
        {isCorrect}
        <br></br>
      </span>
    </div>,

    <div className="">
      <div className="timestamp">Today {time}</div>
      <span className="text-other share">
        <div className="stat-box">
          <div className="stat-box-messages">
            <div className="stat-box-bot">Total Messages</div>
            <div className="stat-box-top emoji">💬</div>
            <div className="stat-box-mid">{total_texts.toLocaleString()}</div>
          </div>
          <div className="stat-box-emojis">
            <div className="stat-box-bot">Top Emojis</div>
            <div className="stat-box-top emoji">🏆</div>
            <div className="stat-box-mid">{emojis}</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-box-messages">
            <div className="stat-box-bot">Top Texter</div>
            <div className="stat-box-top emoji">👥</div>
            <div className="stat-box-mid">{top_chatter}</div>
          </div>
          <div className="stat-box-emojis">
            <div className="stat-box-bot">Peak Activity</div>
            <div className="stat-box-top emoji">{peak_period[2]}</div>
            <div className="stat-box-mid">{peak_period[1]}</div>
          </div>
        </div>
      </span>
      <div className="text-other share stat-box game-box">
        <div>GamePigeon Win Rate</div>
        <RatioBar data={winrate} one={true} />
        <div>
          {percentage}% ({wins.toLocaleString()}W {losses.toLocaleString()}L{" "}
          {draws.toLocaleString()}T)
        </div>
      </div>
      <span className="text-other share last-text-other">
        <div className="stat-box">
          <div className="stat-box-messages">
            <div className="stat-box-bot">Most Active Day</div>
            <div className="stat-box-top emoji">📅</div>
            <div className="stat-box-mid">
              {props.graphData.most_active_day}
            </div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-box-messages">
            <div className="stat-box-bot">Favorite Word</div>
            <div className="stat-box-top emoji">🔠</div>
            <div className="stat-box-mid">{top_word}</div>
          </div>
        </div>
      </span>
      <span className={showSelfMessage ? "text-self" : "hidden"}>
        {selfMessage[index]}
      </span>{" "}
    </div>,
  ];
  const finishedSlides = [
    <div>
      <span className="text-other share">
        <div className="stat-box">
          <div className="stat-box-messages">
            <div className="stat-box-bot">Total Messages</div>
            <div className="stat-box-top emoji">💬</div>
            <div className="stat-box-mid">{total_texts}</div>
          </div>
          <div className="stat-box-emojis">
            <div className="stat-box-bot">Top Emojis</div>
            <div className="stat-box-top emoji">🏆</div>
            <div className="stat-box-mid">{emojis}</div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-box-messages">
            <div className="stat-box-bot">Top Speaker</div>
            <div className="stat-box-top emoji">👥</div>
            <div className="stat-box-mid">{top_chatter}</div>
          </div>
          <div className="stat-box-emojis">
            <div className="stat-box-bot">Peak Activity</div>
            <div className="stat-box-top emoji">{peak_period[2]}</div>
            <div className="stat-box-mid">{peak_period[1]}</div>
          </div>
        </div>
      </span>
      <div className="text-other share stat-box game-box">
        <div>GamePigeon Win Rate</div>
        <RatioBar data={winrate} one={true} />
        <div>
          {percentage}% ({wins}W {losses}L {draws}T)
        </div>
      </div>
      <span className="text-other share last-text-other">
        <div className="stat-box">
          <div className="stat-box-messages">
            <div className="stat-box-bot">Most Active Day</div>
            <div className="stat-box-top emoji">📅</div>
            <div className="stat-box-mid">
              {props.graphData.most_active_day}
            </div>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-box-messages">
            <div className="stat-box-bot">Favorite Word</div>
            <div className="stat-box-top emoji">🔠</div>
            <div className="stat-box-mid">{top_word}</div>
          </div>
        </div>
      </span>
      <span className={showSelfMessage ? "text-self" : "hidden"}>
        {selfMessage[index]}
      </span>{" "}
    </div>,
  ];

  return props.trigger ? (
    <div
      className="popup"
      onClick={() => {
        setFinsished(finished);
        props.setTrigger(false);
      }}
    >
      <div
        className="popup-inner"
        onClick={(e) => {
          e.stopPropagation(); // Prevent the click event from propagating to the outer popup
        }}
      >
        <div id="component-to-download" className="page1">
          <div className="top-bar">
            <div className="top-top-bar">
              <div className="back">
                <FontAwesomeIcon
                  onClick={() => {
                    setFinsished(finished);
                    props.setTrigger(false);
                  }}
                  className="back-button"
                  style={{
                    color: "#0786ff",
                    fontSize: "2em",
                    margin: "0",
                  }}
                  icon={faChevronLeft}
                />
                <span className="back-bubble">34</span>
              </div>

              <div className="contact-container">
                <div className="contact">
                  <ReactSVG className="logo" src={logo} />
                </div>
              </div>

              <div className="facetime-container">
                <FontAwesomeIcon className="facetime" icon={faVideo} />
              </div>
            </div>
            <div className="contact-name">Textronaut</div>
          </div>

          <div
            ref={textsRef}
            className={
              index === slides.length - 1 ? "texts final-slide" : "texts"
            }
          >
            {slides[index]}
            <div
              className={transition ? "spaceholder" : "hidden"}
              style={{ height: spaceHolderHeight }}
            ></div>
            <div
              className={
                index === slides.length - 1 ? "share-last-text" : "hidden"
              }
            >
              <span>textronaut.com</span>
            </div>
            <div ref={messageEndRef} />
          </div>
          <div
            className={
              transition
                ? index === slides.length - 2
                  ? "texts final-slide fadeInUp"
                  : "texts fadeInUp"
                : "hidden"
            }
          >
            {line1s[index]}
          </div>

          <div className="message-bar">
            <div className="plus-container">
              <FontAwesomeIcon className="plus" icon={faPlus} />
            </div>

            <div className="message-container">
              {index === slides.length - 2 ? (
                <div
                  className="custom-input popup-custom-input"
                  ref={messageRef}
                  contentEditable="true"
                  onKeyDown={handleKeyDown}
                ></div>
              ) : (
                <div className={sent ? "transparent" : "message"}>
                  {copying ? (
                    selfMessage[index]
                  ) : slideDone ? (
                    <Typical
                      steps={[selfMessage[index]]} // Set the text to be typed
                      loop={1} // Number of times the text will be typed
                      wrapper="span" // HTML element to wrap the text
                      className="typical-text" // Optional CSS class
                    />
                  ) : (
                    ""
                  )}
                </div>
              )}
              <div className="arrowup-container">
                <FontAwesomeIcon
                  className="arrowup"
                  onClick={handleArrowUp}
                  icon={faArrowUp}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {notification && (
        <div className="copy-notification">Image copied to clipboard</div>
      )}
    </div>
  ) : (
    ""
  );
}

export default Popup;
