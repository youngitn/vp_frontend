import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import Home from './Home';
import TobePickedShippingInfoList from './kanban/TobePickedShippingInfoList';
import PendingStorageList from './kanban/PendingStorageList';
import MateriaPrepareList from './kanban/MateriaPrepareList';
import WorkOrderProductionScheduleList from './kanban/WorkOrderProductionScheduleList';
import Demo from './kanban/MateriaPrepareList_backup';
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
          <Route path="/TobePickedShippingInfoList" component={TobePickedShippingInfoList} exact={true}></Route>
          <Route path="/PendingStorageList" component={PendingStorageList} exact={true}></Route>
          <Route path="/MateriaPrepareList" component={MateriaPrepareList} exact={true}></Route>
          <Route path="/WorkOrderProductionScheduleList" component={WorkOrderProductionScheduleList} exact={true}></Route>
          <Route path="/Excel" component={Excel} exact={true}></Route>
          <Route path="/CounterFather" component={CounterFather} exact={true}></Route>
          <Route path="/Demo" component={Demo} exact={true}></Route>
        </Switch>
      </BrowserRouter> 
    );
  }

}

export default App;