import React, { useState, useEffect } from "react";

const TimedProgressBar = ({ duration }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Uploading files");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          return 100;
        }

        let increment;
        if (oldProgress < 40) {
          increment = Math.random() * 2; // Small increment to simulate lag
        } else if (oldProgress < 80) {
          increment = Math.random() * 5 + 2; // Slightly faster increment
        } else {
          increment = Math.random() * 2 + 8; // Faster near the end
        }

        const newProgress = oldProgress + increment;

        if (newProgress >= 50 && oldProgress < 50) {
          setStatus("Analyzing");
        }

        return Math.min(newProgress, 100);
      });
    }, duration / 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#e0e0e0",
          borderRadius: "5px",
          padding: "3px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: "#0786ff",
            height: "20px",
            borderRadius: "3px",
            transition: "width 0.5s linear",
          }}
        ></div>
      </div>
      <b
        style={{
          marginTop: "13px",
          color: "white",

          padding: "5px 8px",
          textAlign: "center",
        }}
      >
        {status}
      </b>
    </div>
  );
};

export default TimedProgressBar;
//          backgroundColor: "rgba(53, 52, 52, 0.347)",