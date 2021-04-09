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
import WorkOrderProductionScheduleListByArea from './kanban/WorkOrderProductionScheduleListByArea';
import OutsourcingWorkOrderProductionScheduleListByArea from './kanban/OutsourcingWorkOrderProductionScheduleListByArea';
import NoShippingNoticeInfoList from './kanban/NoShippingNoticeInfoList';
import MES from './kanban/Mes';
import Demo from './kanban/MateriaPrepareList_backup';
import Excel from './Excel';
import CounterFather from './components/CounterFather';
import Usdv from './kanban/Usdv';
import TodayShipInfoList from './kanban/TodayShipInfoList';
// import Vendor from './Vendor';
//import Certificate from './Certificate';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact={true}></Route>
          <Route path="/MES" component={MES} exact={true}></Route>
          <Route path="/TobePickedShippingInfoList" component={TobePickedShippingInfoList} exact={true}></Route>
          <Route path="/PendingStorageList" component={PendingStorageList} exact={true}></Route>
          <Route path="/MateriaPrepareList" component={MateriaPrepareList} exact={true}></Route>
          <Route path="/WorkOrderProductionScheduleList" component={WorkOrderProductionScheduleList} exact={true}></Route>
          <Route path="/WorkOrderProductionScheduleListByArea" component={WorkOrderProductionScheduleListByArea} exact={true}></Route>
          <Route path="/OutsourcingWorkOrderProductionScheduleListByArea" component={OutsourcingWorkOrderProductionScheduleListByArea} exact={true}></Route>
          <Route path="/NoShippingNoticeInfoList" component={NoShippingNoticeInfoList} exact={true}></Route>
          <Route path="/Excel" component={Excel} exact={true}></Route>
          <Route path="/CounterFather" component={CounterFather} exact={true}></Route>
          <Route path="/Demo" component={Demo} exact={true}></Route>
          <Route path="/USDV" component={Usdv} exact={true}></Route>
          <Route path="/TodayShipInfoList" component={TodayShipInfoList} exact={true}></Route>
        </Switch>
      </BrowserRouter> 
    );
  }

}

export default App;