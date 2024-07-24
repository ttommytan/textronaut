import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block',  }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block',}}
      onClick={onClick}
    />
  );
};

const SliderComponent = ({slides}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };



  return (
    <div className="slider-container">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="slide">
            {slide}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
