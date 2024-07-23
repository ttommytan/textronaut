

const Leaderboard = ({ data, nameMap, seeMore }) => {
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
      <h2>Text Message Leaderboard</h2>
      {data.slice(0, seeMore ? 10 : data.length ).map((item, index) => {
        const percentage = (item.messages / totalMessages) * 100;
        const isFirstPlace = index === 0;
        return (
          <div key={item.index} className={`leaderboard-item ${isFirstPlace ? 'first-place' : ''}`}>
            <div className="rank">{index + 1}</div>
            <a href={`/phone-number/${item.index}`}className="phone-number">{nameMap ? item.name : item.index}</a>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{width: `${percentage}%`}}
              ></div>
            </div>
            <div className="message-count">{item.messages}</div>
            <div className="percentage">{percentage.toFixed(2)}%</div>
            {isFirstPlace && <div className="crown">👑</div>}
          </div>
        );
      })}
    </div>
  );
};

export default Leaderboard;