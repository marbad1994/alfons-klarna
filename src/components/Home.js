import React, { useState, useEffect } from "react";
import withContext from "../withContext";
import bg1 from "../images/bg1.jpg";
import bg2 from "../images/bg2.jpg";
import bg3 from "../images/bg3.jpg";
import bg4 from "../images/bg4.jpg";

const Home = (props) => {
  let backgroundImages = [bg1, bg2, bg3, bg4]
  const [imageIndex, setImageIndex] = useState(1);
  let metaHeight = props.context.metaHeight
  useEffect(() => {
    let root = document.getElementById("root")
    root.style.height = `calc(100vh + ${parseInt(metaHeight)}px)`

    root.style.backgroundColor = "#1A1E3A"
    // if (root.getAttribute("class") === null) {
    //   root.setAttribute("class", "home-bg")
    //   console.log(metaHeight)
    //   root.style.backgroundImage = `url(${backgroundImages[imageIndex]})`;
    // }
    // if (!root.style.backgroundImage) {
    //   root.style.backgroundImage = `url(${backgroundImages[imageIndex]})`;

    // }
    let timer = setInterval(() => {
      // root.style.backgroundImage = `url(${backgroundImages[imageIndex]})`;
      if (imageIndex === backgroundImages.length - 1) {
        setImageIndex(0)
      } else {
        setImageIndex(imageIndex + 1)
      }
      
    }, 4000)
    return () => {
      clearTimeout(timer);
    };
  });
  return (
    <>
      <div className="container" style={{display: "flex", minHeight: 600}} >
        <div style={{marginLeft: "auto", marginRight: "auto", marginTop: "auto", marginBottom: "auto", display: "flex", flexDirection: "column"}}>
          <div className="crop-container">
          <img src={`/images/logo-full-tp.png`} alt="Sexleksaker Online: Great Secret" className="home-image no-copy"/>
          </div>
        {/* <Logo size={props.context.width < 790 ? (props.context.width/3)/2 - 15 : 120}  /> */}
        {/* <a onClick={() => props.history.push("products")} style={{marginLeft: "auto", marginRight: "auto"}}  className="button is-primary" >Kolla igenom vår kollektion</a> */}
        <a href="https://greatsecret.se/products" style={{marginLeft: "auto", marginRight: "auto", marginTop: "-11%"}}  className="button is-primary is-outlined" >Kolla igenom vår kollektion</a>
        </div>
      </div>
    </>
  );
};

export default withContext(Home); 
