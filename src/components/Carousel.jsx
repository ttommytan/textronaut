import {BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs"
import React, {useState} from "react"

function Carousel({data}) {
    const [index, setIndex] = useState(0);
    const handleNext = () =>
    {
        setIndex(index >= data.length - 1 ? index :  index+1)
    }
    const handleBack = () =>
    {
        setIndex(index === 0 ? index : index-1)
    }
    return (<>
        <div className="carousel">
            <BsArrowLeftCircleFill onClick={handleBack} className="arrow arrow-left"/>
                <div className="carousel-slide"> {data[index]} <br/></div>
            <BsArrowRightCircleFill onClick={handleNext} className="arrow arrow-right"/>
        </div>
        <span className="indicators">
        {data.map((_, idx) => {
          return (
            <button
              key={idx}
              className={
                index === idx ? "indicator" : "indicator indicator-inactive"
              }
              onClick={() => setIndex(idx)}
            ></button>
          );
        })}
      </span>
    </>);
}

export default Carousel