import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "./bulma.css";
import HttpsRedirect from 'react-https-redirect';
require('dotenv').config()


ReactDOM.render(
  <HttpsRedirect>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </HttpsRedirect>,
  document.getElementById('root')
);

console.log(process.env)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
