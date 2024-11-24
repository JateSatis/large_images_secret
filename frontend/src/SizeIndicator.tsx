import React from "react";
import icon from "./assets/IndicatorSVG.svg";
import "./sizeIndicator.css";

function SizeIndicator({ val }) {
  return (
    <div className="size-indicator-div">
      <img src={icon} width="194" height="21" />
      <p className="size-indicator-text ">{val} мкм</p>
    </div>
  );
}

export default SizeIndicator;
