import React, { Component } from "react";
import MaterialTable from "material-table";


import tableIcons from "../TableIcons";

import "moment-timezone";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    // KeyboardDatePicker,
} from "@material-ui/pickers";

import KanbanLocalization from "./publicObj/KanbanLocalization";
import KanbanRunner from "./subComponents/KanbanRunner";
import PageChangeDelayNum from "./subComponents/PageChangeDelayNum";
import { Helmet } from "react-helmet";
import Funcs from "./util/Funcs";

const funcs = new Funcs();
let sdate = funcs.getDateByAfterDays(1);
let edate = funcs.getDateByAfterDays(1);

const tableRef = React.createRef();
const kanbanLocalization = KanbanLocalization;
let runFlag = true;
let pageChangeDelayNum = 5;
let procData = [];

const station_name = [];
station_name[0] = "VP-AS-P06";
station_name[1] = "VP-AS-P07";
station_name[2] = "VP-AS-P08";
station_name[3] = "VP-AS-P09";

station_name[4] = "VP-AU-A";
station_name[5] = "VP-AU-B";
station_name[6] = "VP-AU-C";
station_name[7] = "VP-AU-D";

station_name[8] = "VP-AS-F";
station_name[9] = "VP-AS-G";
station_name[10] = "VP-AU-E";

station_name[11] = "VP-AS-B01";
station_name[12] = "VP-AS-B02";
station_name[13] = "VP-AS-H";
/**package**/
station_name[14] = "VP5-AS-H02";
station_name[15] = "VP5-AS-H03";
station_name[16] = "VP5-AS-H06";
station_name[17] = "VP5-AS-H07";
station_name[18] = "VP5-AS-H08";
station_name[19] = "VP5-AS-H12";
station_name[20] = "VP5-AS-H13";
station_name[21] = "VP-R81";



class Mes extends Component {

    constructor(props) {
        super(props);



        this.state = {
            InvoiceInfos: [],
            isLoading: false,
            perPage: 20,
            fullCount: 0,

            pastDaysCount: '-1', //要輸入負數才會符合期望功能 -1=過去一天
            futureDaysCount: '1',//1=未來一天
            flag: false,
            page: 0,


        };
    }





    doStop = () => {

        runFlag = false;
        tableRef.current.setState(tableRef.current.dataManager.getRenderState());

    }

    keepGoing = async () => {
        runFlag = true;

        this.doPageLoop();
    }

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
            station_name.forEach(async element => {
                await this.getMESInfo(element).then(
                    () => {
                        funcs.delay(0);
                    }//設定等待時間

                );

            });
            pNum = 0;
            //}
            tableRef.current.dataManager.changeCurrentPage(pNum);
            let tableState = tableRef.current.dataManager.getRenderState();


            tableRef.current.setState(tableState);

            pNum++;

        }
    }

    setPage = (pNum) => {
        tableRef.current.dataManager.changeCurrentPage(pNum);
        let tableState = tableRef.current.dataManager.getRenderState();
        tableRef.current.setState(tableState);
    }

    doInit = async () => {
        runFlag = true;



        station_name.forEach(async element => {
            await this.getMESInfo(element).then(
                () => {
                    funcs.delay(0);
                }//設定等待時間

            );

        });
        //console.log(procData);
        this.doPageLoop();


    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    appendLines = (lines) => {
        let formData = new FormData();
        formData.append('line_1_s', lines);
        return formData;
    }

    getMESInfo = async (lines) => {


        //console.log(lines);
        await funcs.delay(1);//設定等待時間 1000=1秒 需考慮讀取資料時間

        let nowPage = this.state.page;
        //var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        let url =
            "http://192.168.0.234:8895/Kanban/ajax/show_more_date_ajax.php/Kanban/ajax/show_more_date_ajax.php";

        //this.setState({ page: nowPage });

        //console.log(url);
        //let formData = new FormData();
        //formData.append('line_1_s', 'VP-AS-P06');
        await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            body: this.appendLines(lines),

        })
            .then((response) => {

                //response.json()
                if (response.ok) {
                    //this.setState({ isLoading: false });

                    return response.json();
                }
                let msg = "";

                switch (response.status) {
                    case 500:
                        msg =
                            "錯誤碼:500 請檢查 API service server,URL= " +
                            url +
                            " 來源無回應; 可能是該出貨日期查無資料導致.";
                        this.setState({ page: 0 });
                        break;
                    case 404:
                        msg = "錯誤碼:檢查 請檢察API URL,出現404錯誤";
                        break;
                    default:
                        msg = "錯誤碼:" + response.status + " 請檢察API URL,出現404錯誤";
                        break;
                }
                //console.log('*************---------');
                throw new Error(msg);
            })
            .then((data) => {

                let tableState = tableRef.current.dataManager.getRenderState();
                //用原table data length 來判斷是否初次讀取資料
                if (tableState.data.length > 0) {
                    //如非初次表示可能有作欄位顯示隱藏等套件功能設置
                    //這時要保留設定狀態須避免re-render行為發生
                    //故使用dataManager.setData給新data
                    //procData = [];
                    this.processMESRes(data);
                    tableRef.current.dataManager.setData(procData);
                    //將給過新data的table state更新回去,
                    //使用table的setState僅re-render table conponent.
                    tableState = tableRef.current.dataManager.getRenderState();
                    tableRef.current.setState(tableState);
                } else {
                    console.log("初次啟動取得資料,更改component state.");

                    this.processMESRes(data);
                    //console.log(procData);
                    this.setState({ InvoiceInfos: procData });
                }

            })
            .catch((error) => {
                console.log(error.message);
                //alert(error.message);
            });
    };



    processMESRes = (res) => {


        //for (let index = 0; index < 4; index++) {
        procData.push(
            {
                LINE_bad: res.LINE_bad[0].LINE_bad,
                LINE_complete: res.LINE_complete[0].LINE_complete,
                LimitedProductID: res.LimitedProductID[0].LimitedProductID,
                ListPrice: res.ListPrice[0].ListPrice,
                M_Name: res.M_Name[0].M_Name,
                M_spec: res.M_spec[0].M_spec,
                Mimg: res.Mimg[0].Mimg||0,
                Name: res.Name[0].Name,
                Price: res.Price[0].Price,
                SumSales: res.SumSales[0].SumSales
            }
        )


        //}

    };



    handlePerPage = (event, newValue) => {
        //alert(newValue);
        tableRef.current.dataManager.changePageSize(newValue);
        let tableState = tableRef.current.dataManager.getRenderState();
        tableRef.current.setState(tableState);
    };


    handlePageChangeDelayNum = (value) => {
        pageChangeDelayNum = value;
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({ perPage: (parseInt(event.target.value, 10)) });


    };

    handlePastDaysCountChange = (event) => {
        this.setState({
            pastDaysCount: event.target.value,
            lastMDate: funcs.getDateByAfterDays(parseInt(event.target.value))
        });
    }

    handleFutureDaysCountChange = (event) => {
        this.setState({
            futureDaysCount: event.target.value,
            endDate: funcs.getDateByAfterDays(parseInt(event.target.value))
        });

    }

    handlePastDaysCountChangeByValue = (value) => {
        sdate = value;
        console.log('p sdate=' + sdate);
    }

    handleFutureDaysCountChangeByValue = (value) => {
        edate = value;
        console.log('p edate=' + edate);
    }



    /**
     * KeyboardDatePicker API ref:https://material-ui-pickers.dev/api/KeyboardDatePicker
     * date:預設日期資訊
     * dateValue:格式化後的日期資訊
     */
    handleEndDateChange = (date, dateValue) => {

        this.setState({ endDate: dateValue });
    };

    render() {
        const { InvoiceInfos } = this.state;
        //console.log(InvoiceInfos);
        return (
            <div style={{ maxWidth: "100%" }}>
                <Helmet>
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width"
                    />
                    <title>MES</title>

                </Helmet>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                        <h2>MES</h2>

                        <Grid item xs={12} sm={1}>
                            <PageChangeDelayNum parentHandlePageChangeDelayNum={this.handlePageChangeDelayNum}></PageChangeDelayNum>
                        </Grid>
                        <Grid item xs={12} sm={1}>

                        </Grid>
                        <Grid item xs={12} sm={5}>

                            <KanbanRunner parentDoInit={this.doInit} parentDoStop={this.doStop} parentKeepGoing={this.keepGoing}
                                parentHandlePastDaysCountChangeByValue={this.handlePastDaysCountChangeByValue}
                                parentHandleFutureDaysCountChangeByValue={this.handleFutureDaysCountChangeByValue}
                            ></KanbanRunner>

                        </Grid>
                    </Grid>
                </MuiPickersUtilsProvider>

                <MaterialTable
                    title=""
                    // onRowClick={((evt, selectedRow) => this.setState({ selectedRow }))}
                    options={{
                        search: false,
                        columnsButton: true,
                        exportButton: false,
                        pageSize: 30,//設置一個選項

                    }}

                    icons={tableIcons}
                    columns={[
                        { title: "工單號碼", field: "LimitedProductID" },
                        { title: "不良待處理", field: "Mimg" },
                        { title: "工單生產數量", field: "Name" },
                        { title: "已入庫總數", field: "Price" },
                        { title: "線別名稱", field: "ListPrice" },
                        { title: "訂單+項次", field: "SumSales" },
                        { title: "料件 品名", field: "M_Name" },
                        { title: "料件 規格", field: "M_spec" },
                        { title: "各站 每日完成數量", field: "LINE_complete" },
                        { title: "各站 每日報廢組數", field: "LINE_bad" },
                       
                        
                    ]}

                    data={InvoiceInfos}
                    tableRef={tableRef}
                    // other props
                    localization={kanbanLocalization}

                />


            </div >
        );
    }
}

export default Mes;
