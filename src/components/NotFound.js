import React, { useEffect } from "react";
import withContext from "../withContext";

const NotFound = () => {
  
  
  useEffect(() => {
    document.getElementById("root").style.backgroundImage = null;
    document.getElementById("root").style.display = null;


  });
  return (
   
    <>
          <div className="container" style={{minHeight: 600}}>
         <div className="column">
            <div className="title has-text-grey-light"><h1>404 - page not found</h1></div>
            </div>
      <br />
      </div>
       
    </>
  );
};

export default withContext(NotFound);
