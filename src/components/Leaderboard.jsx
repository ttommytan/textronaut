

const Leaderboard = ({ data, nameMap, width, link }) => {
  const totalMessages = data.reduce((sum, item) => sum + item.messages, 0);
  /*
  const handlePhoneClick = async () => {
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
  */
  return (
    <div className="leaderboard">
      
      <div className="leaderboard-list">
      {data.map((item, index) => {
        const percentage = (item.messages / totalMessages) * 100;
        const isFirstPlace = index === 0;
        return (
          <div
            key={item.index}
            className={`leaderboard-item ${isFirstPlace ? "first-place" : ""}`}
          >
            <div className="rank">{index + 1}</div>
            {link ? (
              <a
                href={`/phone-number/${item.index}`}
                target="_blank"
                className="phone-number"
              >
                {nameMap ? item.name : item.index}
              </a>
            ) : (
              <span
                href={`/phone-number/${item.index}`}
                target="_blank"
                className="phone-number"
              >
                {nameMap ? item.name : item.index}
              </span>
            )}

            <div className={width < 1276 ? "progress-bar-container" : "hidden"}>
              <div
                className="progress-bar"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            <div className="message-count">
              {item.messages.toLocaleString()}
            </div>
            <div className="percentage">{percentage.toFixed(2)}%</div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default Leaderboard;

/*


            {isFirstPlace && <div className="crown">👑</div>}
            */