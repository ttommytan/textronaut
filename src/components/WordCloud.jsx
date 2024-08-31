import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';

const colors = ['#143059', '#2F6B9A', '#82a6c2'];

function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

const WordCloud = ({ width, height, showControls, wordList }) => {
  const [key, setKey] = useState([]);
  const [index, setIndex] = useState(2);
  const [graphData, setGraphData] = useState();
  const [words, setWords] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);
  const containerRef = useRef(null);

  useEffect(() =>{
    if (Object.keys(wordList).length > 1) {
      setKey( Object.keys(wordList));
      setWords(wordList[Object.keys(wordList)[index]])
    }

  },[index])

  if (!wordList) {
    return <h3>loading ...</h3>
  }




  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: [10, 100],
  });

  const fontSizeSetter = (datum) => fontScale(datum.value);
  const fixedValueGenerator = () => 0.5;

  const [spiralType, setSpiralType] = useState('archimedean');
  const [withRotation, setWithRotation] = useState(false);

  const handleMouseMove = useCallback((event, datum) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - containerRect.left + 10; // 10px offset from cursor
      const y = event.clientY - containerRect.top + 10; // 10px offset from cursor
      setTooltipData({ x, y, text: datum.text, value: datum.value });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltipData(null);
  }, []);

  return (
    <div className="wordcloud" ref={containerRef}>
      <Wordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={'Impact'}
        padding={2}
        spiral={spiralType}
        rotate={withRotation ? getRotationDegree : 0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
              onMouseMove={(event) => handleMouseMove(event, w)}
              onMouseLeave={handleMouseLeave}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
      <div className='word-cloud-buttons'>
        <button className={index === 2 ? "word-cloud-button-on": "word-cloud-button"} onClick={()=>setIndex(2)}>You</button>
        <button className={index === 1 ? "word-cloud-button-on": "word-cloud-button"} onClick={()=>setIndex(1)}>Them</button>
        <button className={index === 0 ? "word-cloud-button-on": "word-cloud-button"} onClick={()=>setIndex(0)}>Total</button>
       </div>
      {tooltipData && (
        <div
          style={{
            position: 'absolute',
            top: `${tooltipData.y}px`,
            left: `${tooltipData.x}px`,
            backgroundColor: 'white',
            color: 'black',
            padding: '5px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            fontSize: '14px',
            pointerEvents: 'none',
          }}
        >
          {`${tooltipData.text}: ${tooltipData.value} times`}
        </div>
      )}
      {showControls && (
        <div>

          <label>
            With rotation &nbsp;
            <input
              type="checkbox"
              checked={withRotation}
              onChange={() => setWithRotation(!withRotation)}
            />
          </label>
          <br />
        </div>
      )}
      <style jsx>{`
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
          position: relative;
          height: 100%;
        }
        .wordcloud svg {
          margin: 1rem 0;
          
        }
        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .wordcloud textarea {
          min-height: 100px;
        }
      `}</style>
    </div>
  );
};

export default WordCloud;
/*

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';

const colors = ['#143059', '#2F6B9A', '#82a6c2'];

function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

const WordCloud = ({ width, height, showControls, wordList }) => {
  if (!wordList) {
    return <h3>loading ...</h3>
  }

  const [words, setWords] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const wordFreqs = wordList;
    setWords(wordFreqs);
  }, [wordList]);

  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: [10, 100],
  });

  const fontSizeSetter = (datum) => fontScale(datum.value);
  const fixedValueGenerator = () => 0.5;

  const [spiralType, setSpiralType] = useState('archimedean');
  const [withRotation, setWithRotation] = useState(false);

  const handleMouseMove = useCallback((event, datum) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - containerRect.left + 10; // 10px offset from cursor
      const y = event.clientY - containerRect.top + 10; // 10px offset from cursor
      setTooltipData({ x, y, text: datum.text, value: datum.value });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltipData(null);
  }, []);

  return (
    <div className="wordcloud" ref={containerRef}>
      <Wordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={'Impact'}
        padding={2}
        spiral={spiralType}
        rotate={withRotation ? getRotationDegree : 0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
              onMouseMove={(event) => handleMouseMove(event, w)}
              onMouseLeave={handleMouseLeave}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
      {tooltipData && (
        <div
          style={{
            position: 'absolute',
            top: `${tooltipData.y}px`,
            left: `${tooltipData.x}px`,
            backgroundColor: 'white',
            color: 'black',
            padding: '5px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            fontSize: '14px',
            pointerEvents: 'none',
          }}
        >
          {`${tooltipData.text}: ${tooltipData.value} occurrences`}
        </div>
      )}
      {showControls && (
        <div>
          <label>
            Spiral type &nbsp;
            <select
              onChange={(e) => setSpiralType(e.target.value)}
              value={spiralType}
            >
              <option key={'archimedean'} value={'archimedean'}>
                archimedean
              </option>
              <option key={'rectangular'} value={'rectangular'}>
                rectangular
              </option>
            </select>
          </label>
          <label>
            With rotation &nbsp;
            <input
              type="checkbox"
              checked={withRotation}
              onChange={() => setWithRotation(!withRotation)}
            />
          </label>
          <br />
        </div>
      )}
      <style jsx>{`
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
          position: relative;
        }
        .wordcloud svg {
          margin: 1rem 0;
          
        }
        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .wordcloud textarea {
          min-height: 100px;
        }
      `}</style>
    </div>
  );
};

export default WordCloud;*/