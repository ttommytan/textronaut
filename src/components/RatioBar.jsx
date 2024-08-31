import React from 'react';

function RatioBar({ data, one}) {

    if (one){
        const total = data[0]['num'] + data[1]['num'] + data[2]['num']
        const percentage = Math.round((data[0]['num'] /(total))*100);
        const drawPercentage = 100 * data[2]['num']/total;
        return (
            <div className="ratio-container">
                <div className="ratio-bar-container">
                    <div className="ratio-bars">
                        <div 
                            className="ratio-bar" 
                            style={{width: `${percentage}%`}}
                            title={`Win rate: ${percentage}%`}
                        />
                        <div className='game-emoji emoji' style={{left: `${percentage - 2}%`}}>🎮</div>
                        <div 
                            className="draw-ratio-bar" 
                            style={{width: `${drawPercentage < 5 ? 0 : drawPercentage}%`}}
                            title={`Draw rate: ${drawPercentage}%`}
                        />
                    </div>
                </div>

            </div>
        );
    }
    else{
    return (
      <div className="ratio-container">
        {data
          .sort((a, b) => {
            const sumA = a[1][0] + a[1][1];
            const sumB = b[1][0] + b[1][1];
            return sumB - sumA;
          })
          .map(([key, value], idx) => {
            const percentage = value[3];
            const drawPercentage = value[4];
            return (
              <div key={`${key}-${idx}`} className="ratio-item">
                <div>{key}</div>
                <div className="ratio-bar-container">
                  <div className="ratio-bars">
                    <div
                      className="ratio-bar"
                      style={{ width: `${percentage}%` }}
                      title={`Win rate: ${percentage}%`}
                    />
                    <div
                      className="draw-ratio-bar"
                      style={{
                        width: `${drawPercentage < 5 ? 0 : drawPercentage}%`,
                      }}
                      title={`Draw rate: ${drawPercentage}%`}
                    />
                  </div>
                </div>
                <div className="kda">
                  {value[3]}%({value[0].toLocaleString()}W{" "}
                  {value[1].toLocaleString()}L)
                </div>
              </div>
            );
          })}
      </div>
    );}
}

export default RatioBar;