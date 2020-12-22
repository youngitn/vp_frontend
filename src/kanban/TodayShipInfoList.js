import React, { Component } from "react";
import MaterialTable from "material-table";
import KanbanRunner from "./subComponents/KanbanRunner";

import tableIcons from "../TableIcons";
import axios from "axios";
import "moment-timezone";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    // KeyboardDatePicker,
} from "@material-ui/pickers";

import KanbanLocalization from "./publicObj/KanbanLocalization";

import { Helmet } from "react-helmet";
import Funcs from "./util/Funcs";
import MyNavbar from '../MyNavbar';
const funcs = new Funcs();


const tableRef = React.createRef();
const kanbanLocalization = KanbanLocalization;
let runFlag = true;
let pageChangeDelayNum = 5;
let procData = [];




class TodayShipInfoList extends Component {

    constructor(props) {
        super();

        this.state = {
            data: [],
            pastDaysCount: '-1', //要輸入負數才會符合期望功能 -1=過去一天
            futureDaysCount: '1',//1=未來一天
            flag: false,
            page: 0,
        };


    }





    handleGetData = () => {
        
        var that = this;
        axios.get('/kanbanApi/getTodayShipInfoList?ent=100&site=TWVP')
            .then(function (response) {
                that.handleData(response.data.data);
                // handle success
                console.log(response.data.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

    // handlePerPage = (event, newValue) => {
    //     //alert(newValue);
    //     tableRef.current.dataManager.changePageSize(newValue);
    //     let tableState = tableRef.current.dataManager.getRenderState();
    //     tableRef.current.setState(tableState);
    // };



    handleData = (data) => {

        this.setState({ data: data });
    };

    handleEmpCode = (event) => {

        this.setState({ Emp_code: event.target.value });
    };

    handleProMachineCode = (event) => {

        this.setState({ ProMachine_Code: event.target.value });
    };

    handleBoxCode= (event) => {

        this.setState({ Box_Code: event.target.value });
    };
    doStop = () => {

        runFlag = false;
        tableRef.current.setState(tableRef.current.dataManager.getRenderState());

    }

    keepGoing = async () => {
        runFlag = true;

        this.doPageLoop();
    }
    doInit = async () => {
        runFlag = true;
        await this.handleGetData();
        //console.log(procData);
        this.doPageLoop();


    };

    doPageLoop = async () => {
        let pNum = this.state.page;
        //迴圈會循序執行邏輯,才會等待
        for (let i = 30; i > 1; i++) {
            i = 2;
            if (!runFlag) {
                break;
            }
            await funcs.delay(pageChangeDelayNum * 1000);
            //console.log(tableRef.current.dataManager.data.length);
            //if ((pNum * tableRef.current.dataManager.pageSize) > tableRef.current.dataManager.data.length) {
            procData= [];
            //超過可讀取的數量後 重整資料.
            await this.handleGetData();
            pNum = 0;
            //}
            tableRef.current.dataManager.changeCurrentPage(pNum);
            let tableState = tableRef.current.dataManager.getRenderState();


            tableRef.current.setState(tableState);

            pNum++;

        }
    }

    handlePastDaysCountChangeByValue = (value) => {
        
    }

    handleFutureDaysCountChangeByValue = (value) => {
       
    }

    render() {
        const data = this.state.data;
        //console.log(InvoiceInfos);
        return (
            <div style={{ maxWidth: "100%" }}>
                <MyNavbar />
                <Helmet>
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width"
                    />
                    <title>今日已建出貨單列表</title>

                </Helmet>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">



                        <Grid item sm={12} md={2}>
                            
                        </Grid>
                        {
                            /*
                            <Grid item sm={12} md={2}>
                                工令:<TextField></TextField>
                            </Grid>
                            <Grid item sm={12} md={2}>
                                桶號:<TextField></TextField>
                            </Grid>*/

                        }
                        <Grid item sm={12} md={2}>
                           
                        </Grid>
                        <Grid item md={2} sm={12}>
                            
                        </Grid>

                        <Grid>
                        <KanbanRunner parentDoInit={this.doInit} parentDoStop={this.doStop} parentKeepGoing={this.keepGoing}
                                parentHandlePastDaysCountChangeByValue={this.handlePastDaysCountChangeByValue}
                                parentHandleFutureDaysCountChangeByValue={this.handleFutureDaysCountChangeByValue}
                            ></KanbanRunner>
                        </Grid>
                    </Grid>
                </MuiPickersUtilsProvider>

                <MaterialTable
                    title="今日已建出貨單列表"
                    // onRowClick={((evt, selectedRow) => this.setState({ selectedRow }))}
                    options={{
                        search: false,
                        columnsButton: true,
                        exportButton: true,
                        pageSize: 30,//設置一個選項

                    }}

                    icons={tableIcons}
                    columns={[
                        { title: "出貨單號", field: "xmdkdocno" },
                        { title: "建立時間", field: "xmdkcrtdt" },
                        { title: "出通單號", field: "xmdk005" },
                        // { title: "訂單單號", field: "xmdk006" },
                        



                    ]}

                    data={this.state.data}
                    tableRef={tableRef}
                    // other props
                    localization={kanbanLocalization}

                />


            </div >
        );
    }
}

export default TodayShipInfoList;
