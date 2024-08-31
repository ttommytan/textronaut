import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/TextronautLogo.svg";
import { ReactSVG } from "react-svg";
import {
  faPlus,
  faVideo,
  faChevronUp,
  faChevronLeft,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import Typical from "react-typical";
import RatioBar from "./RatioBar";
import PreviewDots from "./PreviewDots";
function Phone(props) {
  const [time, setTime] = useState("");
  const [index, setIndex] = useState(0);
  const [selfMessage, setSelfMessage] = useState([
    "Yes!",
    "How many messages did I send?",
    "Who was I texting?",
    "What were my favorite words!",
    "Thats cool",
    "lala",
    "Share your Text Life! --------->",
    "share my texting personality!",
  ]);

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
  let tempIndex = "Number";
  if (props.nameMap) {
    tempIndex = "Name";
  }

  if (!props.loading) {
    morning = props.graphData["recap_stats"]["morning"];
    afternoon = props.graphData["recap_stats"]["afternoon"];
    night = props.graphData["recap_stats"]["night"];
    number1 = props.graphData["recap_stats"]["number1"];
    total_texts = props.graphData["recap_stats"]["total_texts"];
    total_minutes = Math.round(total_texts / 36);
    total_days =
      total_minutes > 720
        ? ` or ${(total_minutes / 1440).toFixed(2)} days`
        : "";
    num_contact = props.graphData["recap_stats"]["num_contact"];
    winrate = props.graphData.game_stats.win_loss.wlt;
    total = winrate[0]["num"] + winrate[1]["num"] + winrate[2]["num"];
    wins = winrate[0]["num"];
    losses = winrate[1]["num"];
    draws = winrate[2]["num"];
    if (props.graphData.random_text && props.graphData.random_text.length > 0)
      random_text = props.graphData.random_text[0];

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
    emojis = Object.entries(props.graphData.all_emojis)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, value], idx) => {
        return <span key={idx}>{key}</span>;
      });
    const topEmoji = Object.entries(props.graphData.all_emojis)[0];
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
      top5 = "Sorry no messages were found in your file :(";
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
                {word.name}: {word.messages}
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
                {word.index}: {word.messages}
              </li>
            ))}
        </ol>
      );
    }
  }
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

  const finishedSlides = (
    <div>
      <div className="timestamp">Today {time}</div>
      <span className="text-other">Your Texting Wrapped is here</span> <br></br>
      <span className="text-other">
        Ready to get into the thick of it?
      </span>{" "}
      <br></br>
      <span className="text-other">
        This year you ventured into the social-verse and made {num_contact} new
        friends, look at you you social butterfly
      </span>
      <span className="text-other">
        🌄From sunrise to sunset you kept texting {number1[1]}🌇 <br></br>
      </span>
      <span className="text-other">
        🌅Your morning started with {morning[1]}🌅 <br></br>
      </span>
      <span className="text-other">
        You seized the day with {afternoon[1]} <br></br>
      </span>
      <span className="text-other">
        🌌You embraced the night with {night[1]}🌌 <br></br>
      </span>
      <div className="timestamp">Today {time}</div>
      <span className="text-other line1">
        All that texting added up to {total_texts} which is around{" "}
        {total_minutes} minutes{total_days}!
      </span>
      <span className="text-other">
        With one person it was love at first text: {number1[1]}! <br></br>
      </span>
      <span className="text-other">
        You texted over {num_contact} people but you texted these people again
        and again:<br></br>
      </span>
      <span className="text-other">
        You seized the day with {afternoon[1]} <br></br>
      </span>
      <span className="text-other">
        🌌You embraced the night with {night[1]}🌌 <br></br>
      </span>
      <div className="timestamp">Today {time}</div>
      <span className="text-other line1">
        You also used {total_texts} words but your top 5 favorite words are{" "}
        {top5} <br />
      </span>
      <span className="text-other">
        With one person it was love at first text: {number1[1]}! <br></br>
      </span>
      <span className="text-other">
        You texted over {num_contact} people but you texted these people again
        and again:<br></br>
      </span>
      <span className="text-other">
        You seized the day with {afternoon[1]} <br></br>
      </span>
    </div>
  );

  const finishedSlides2 = (
    <div>
      <div>
        <div className="timestamp">Today {time}</div>
        <span className="text-other">
          📱 Your Texting Wrapped is here!
        </span>{" "}
        <br></br>
        <span className="text-other">Ready for the juicy details?</span>{" "}
        <br></br>
        <div className="guess-self">
          <span className="text-self">{selfMessage[0]}</span>
        </div>
      </div>

      <div>
        <div className="timestamp">Today {time}</div>
        <span className="text-other">
          🌅 From dawn to dusk, you were a texting machine with {number1[1]}! 🤖
        </span>
        <span className="text-other">
          ☀️ Your day kicked off with {morning[1]} morning texts<br></br>
        </span>
        <span className="text-other">
          🌞 You conquered the afternoon with {afternoon[1]} messages <br></br>
        </span>
        <span className="text-other">
          🌙 And wrapped up with {night[1]} night owl texts <br></br>
        </span>
        <div className="guess-self">
          <span className="text-self">{selfMessage[1]}</span>
        </div>
      </div>

      <div>
        <div className="timestamp">Today {time}</div>
        <span className="text-other">
          🎉 Drumroll please... You've sent a jaw-dropping{" "}
          {total_texts.toLocaleString()} messages in total! <br />
        </span>
        <span className="text-other">
          ⏰ That's roughly {total_minutes.toLocaleString()} minutes or{" "}
          {total_days.toLocaleString()} of non-stop texting😱.<br></br>
        </span>
        <span className="text-other">
          Your fingers were on 🔥fire🔥 at {peak_period[1]} for a total of{" "}
          {peak_period[3].toLocaleString()} texts!
        </span>
        <div className="guess-self">
          <span className="text-self">{selfMessage[2]}</span>
        </div>
      </div>

      <div>
        <div className="timestamp">Today {time}</div>
        <span className="text-other">
          🏆 Your texting BFF was {number1[1]} with a whopping{" "}
          {numTopText.toLocaleString()} messages!
        </span>
        <span className="text-other">
          🌟 Your top 5 texting buddies were:<br></br>
        </span>
        <span className="text-other">
          {top5} <br></br>
        </span>
        <div className="guess-self">
          <span className="text-self">{selfMessage[3]}</span>
        </div>
      </div>

      <div>
        <div className="timestamp">Today {time}</div>
        <span className="text-other">
          📚 You're a walking dictionary with{" "}
          {unique_word_count.toLocaleString()} unique words used! <br />
        </span>
        <span className="text-other">
          Your top 5 most used words were: {top5}
        </span>
        <span className="text-other">
          And your emoji of choice? The one and only {firstEmoji}!<br></br>
        </span>
        <div className="guess-self">
          <span className="text-self">{selfMessage[4]}</span>
        </div>
      </div>

      <div>
        <div className="timestamp">Today {time}</div>
        <span className="text-other">How well do you know you?</span>
        <span className="text-other">
          We're talking 3 AM, texting with no lights on you! <br></br>
        </span>
        <span className="text-other">
          Let's play guess the texter. I give you a text and you guess the
          speaker.<br></br>
        </span>
        <span className="text-other">
          "
          {random_text
            ? random_text["Message"]
            : "Sorry no messages were found in your file :("}
          " <br></br>
        </span>
        <span className="text-other">
          {random_text
            ? `It was ${random_text[tempIndex]} Now let's check out your final
          stats!`
            : "But we did find your other stats, now let's check it out!"}
          <br></br>
        </span>
      </div>

      <div>
        <div className="timestamp final-timestamp">Today {time}</div>
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
              <div className="stat-box-bot">Top Chatter</div>
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
        <span className="text-other share">
          <div className="stat-box">
            <div className="stat-box-messages">
              <div className="stat-box-bot">Most Active Day</div>
              <div className="stat-box-top emoji">📅</div>
              <div className="stat-box-mid">{max_day.index}</div>
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
        <div className="share-last-text">textronaut.com</div>
      </div>
    </div>
  );

  return (
    <div className="page1 phone-page">
      <div className="top-bar">
        <div className="top-top-bar">
          <div className="back">
            <FontAwesomeIcon
              onClick={() => {
                props.setTrigger(false);
              }}
              className="back-button"
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
      <div className="texts phone-texts">{finishedSlides2}</div>

      <div className="message-bar">
        <FontAwesomeIcon className="plus" icon={faPlus} />

        <div className="message-container">
          <div className="message">Share your Text Life! ---------></div>
          <FontAwesomeIcon
            className="arrowup"
            onClick={() => {
              index >= slides.length - 1
                ? setIndex(index)
                : setIndex((i) => i + 1);
            }}
            icon={faArrowUp}
          />
        </div>
      </div>
    </div>
  );
}
export default Phone;
