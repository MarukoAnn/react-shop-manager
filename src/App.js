import React from 'react';
import Home from "./view/home/home";
import {HashRouter as Router,Redirect, Route} from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="App">
		<Router>
			<Redirect from={'/'}  to={'/home'} />
			<Route path={'/home'} component={Home}/>
		</Router>
    </div>
  );
}

export default App;
