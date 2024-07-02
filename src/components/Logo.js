import React from "react";
import withContext from "../withContext";

const Logo = props => {
  return (
    <div style={{fontSize: props.size, display: "flex", ...props.style}}> <h4 className="start-logo">Great</h4><h4 className="end-logo">\Secret</h4></div>

  );
};

export default withContext(Logo);
