import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt, faTruckMoving, faBoxOpen } from '@fortawesome/free-solid-svg-icons'

const iconText = (icon, text) => {
  return (
    <div className="columns is-desktop">
  <div className="column" style={{maxWidth: 230, marginLeft: "auto", marginRight: "auto"}}>
  <div className="has-text-grey-light" style={{textAlign: "center"}} ><FontAwesomeIcon icon={icon} size="2x"/></div>
  <div className="has-text-grey-light"><h5  style={{ textAlign: "center", fontWeight: 500}}>{text}</h5></div>
  </div>
</div>

  )
}

const IconBar = props => {

  return (
    <div className="container" style={{marginBottom: -15, marginTop: 15}}>
<div className="row" style={{display: "flex"}}>
    <div className="column">
      {iconText(faExchangeAlt, "100 dagars öppet köp")}
       </div>
       <div className="column">
       {iconText(faTruckMoving, "Alltid fri frakt")}

       </div>
       <div className="column">
       {iconText(faBoxOpen, "Diskret leverans, i excklusiv förpackning")}
       </div>
       </div>
       </div>
  );
};

export default IconBar;
