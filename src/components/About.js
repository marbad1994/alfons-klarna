import React from "react";
import MailTo from "./MailTo";
import { SocialIcon } from 'react-social-icons';

const About = props => {

  return (
    <>
    <div style={{minHeight: 520}}>
    <div className="container" style={{marginBottom: 20, marginTop: 30}}>
      <div className="box">
      <div className="column">
            <div className="title has-text-grey-light"><h1>Om Oss</h1></div>
            </div>
      <br />
    <p>
    Great Secret startades i syfte att öka kvalitén och lyxen kring sexleksaker. Våra mål som företag är att vara med och ta bort stigmat från njutning samt sudda ut gränserna mellan "manliga" och "kvinnliga" sexleksaker.
    Hos oss är alla välkomna att handla och syftet med just ditt köp, bestämmer bara du.
    <br/>
    I första hand är Great Secret ett varumärke som tar fram högkvalitativa produkter med ett helthets tänk kring lyx och exclusivitet. Därför har vi i första kollektionen tagit fram ett fåtal produkter som når upp till den kvalitén vi vill erbjuda.
    Vi erbjuder våra kunder att köpa våra Sexleksaker Online här hos oss.

</p>
<br/>
<br/>
<div className="title has-text-grey-light" style={{fontSize: 25}}><h3>Bli återförsäljare</h3></div>
<p>
  Vi på Great Secret är alltid öppna nya återförsäljare och partners.
  Skicka ett mail till <MailTo email="info@greatsecret.se" title="Återförsäljare" subject="Återförsäljare förfrågan"/>.
</p>

<br/>
<div className="title has-text-grey-light" style={{fontSize: 25}}><h3>Sponsorskap</h3></div>
<p>
  Driver du en blogg, en Only Fans eller liknande och vill vara med och marknadsföra Great Secret,
  skicka ett mail till <MailTo email="info@greatsecret.se" title="Sponsorskap" subject="Sponsorskap förfrågan"/> och beskriv din verksamhet så försöker vi skräddarsy en lösning som fungerar för just dig.
</p>

<br/>
<div className="title has-text-grey-light" style={{fontSize: 25}}><h3>Följ oss på sociala medier</h3></div>
<p>
  <SocialIcon url="https://www.facebook.com/Great-Secret-109652344671502"/>
</p>


</div>
</div>
</div>
</>
  );
};

export default About;
