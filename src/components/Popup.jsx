import React, {useState} from "react";

function Popup(props){
    const handleNext = () =>
    {
        props.setStatsIndex(props.statsIndex >= props.length - 1 ? props.statsIndex :  props.statsIndex + 1)
    }
    const handleBack = () =>
    {
        props.setStatsIndex(props.statsIndex === 0 ? props.statsIndex : props.statsIndex - 1)
    }
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button onClick={() => props.setTrigger(false)}>Close</button>
                <p className="popup-slide-container">
                    {props.children}
                </p>
            </div>
        </div>
    )
    : "";

}

export default Popup