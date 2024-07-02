import React from "react";
import MailTo from "./MailTo";
import { SocialIcon } from 'react-social-icons';

const Footer = props => {

  return (
    <footer className="footer" style={{paddingBottom: 15, marginTop: 100}}>
  <div className="content menu">    
  <p className="menu-label" style={{marginLeft: 12}}>
  <strong>Great Secret</strong>
  </p>
  <p className="menu-label" style={{marginLeft: 12}}>
  <strong>Orgnummer: </strong>94110444978
 
  </p>
  <p className="menu-label" style={{marginLeft: 12}}>

  <strong>Address: </strong>Soltorpsgatan 20b 431 67 Mölndal
  </p>
  <p className="menu-label" style={{marginLeft: 12}}>

  <strong>Kontakt: </strong><MailTo email="info@greatsecret.se" title="info@greatsecret.se" subject=""/>
  </p>
  <div style={{marginTop: -10}}>

  <p className="menu-label">
 
  <strong><a href="https://greatsecret.se/about" className="navbar-item">Om oss </a></strong>
  </p>
  </div>
  <div style={{marginTop: -10, display: "flex"}}>
  <p className="menu-label">
 
  <strong><a href="https://greatsecret.se/terms" className="navbar-item">Köpvillkor </a></strong>
  </p>
  <div style={{marginLeft: "auto"}}>
  <SocialIcon url="https://www.facebook.com/Great-Secret-109652344671502" style={{marginRight: 20, marginTop: -20}}/>
    <a href="https://www.klarna.com/se/" target="_blank" rel="noreferrer">
  <img src="https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg" alt="klarna"/>
  </a>
  </div>
  </div>
  </div>
</footer>
  );
};

export default Footer;
