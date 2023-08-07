import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Router from react-router-dom
// In order for the Router to work you need to wrap the <App /> inside it
import { BrowserRouter as Router } from "react-router-dom";
import { CurrentUserProvider } from "./context/CurrentUserContext";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <CurrentUserProvider>
        <App />        
      </CurrentUserProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
