import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import Home from './Home';
import Member from './Member';
import Excel from './Excel';
import CounterFather from './components/CounterFather';
// import Vendor from './Vendor';
//import Certificate from './Certificate';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact={true}></Route>
          <Route path="/members" component={Member} exact={true}></Route>
          <Route path="/Excel" component={Excel} exact={true}></Route>
          <Route path="/CounterFather" component={CounterFather} exact={true}></Route>
        </Switch>
      </BrowserRouter> 
    );
  }

}

export default App;