import React, { Component } from "react";
import MaterialTable from "material-table";


import tableIcons from "../TableIcons";
import Slider from "@material-ui/core/Slider";

import Typography from "@material-ui/core/Typography";

import "moment-timezone";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  // KeyboardDatePicker,
} from "@material-ui/pickers";

import DataPerPageMark from "./publicObj/DataPerPageMark";
import KanbanLocalization from "./publicObj/KanbanLocalization";
import KanbanRunner from "./subComponents/KanbanRunnerWithDateRangeController";
import PageChangeDelayNum from "./subComponents/PageChangeDelayNum";
import { Helmet } from "react-helmet";
import Funcs from "./util/Funcs";

const funcs = new Funcs();
let sdate = funcs.getDateByAfterDays(1);
let edate = funcs.getDateByAfterDays(1);
const marks = DataPerPageMark;
const tableRef = React.createRef();
const kanbanLocalization = KanbanLocalization;
let runFlag = true;
let pageChangeDelayNum = 5;
class TobePickedShippingInfoList extends Component {
  constructor(props) {
    super(props);



    this.state = {
      InvoiceInfos: [],

      isLoading: false,
      perPage: 5,
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
      if ((pNum * tableRef.current.dataManager.pageSize) > tableRef.current.dataManager.data.length) {

        //超過可讀取的數量後 重整資料.
        await this.getTobePickedShippingInfoList().then(
          () => funcs.delay(0)//設定等待時間
        );
        pNum = 0;
      }
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


    await this.getTobePickedShippingInfoList().then(
      () => {
        funcs.delay();
      }//設定等待時間

    );

    this.doPageLoop();


  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getTobePickedShippingInfoList = async () => {



    await funcs.delay(1);//設定等待時間 1000=1秒 需考慮讀取資料時間
    const diffTime = Math.abs(new Date(sdate) - new Date(edate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffTime + " milliseconds");
    console.log(diffDays + " days");
    console.log(sdate);
    console.log(edate);


    let nowPage = this.state.page;
    let url =
      "kanbanApi/getTobePickedShippingInfoList?expShipEndDate=" + edate;
    url += "&expShipStartDate=" + sdate;
    url += "&per_page=" + this.state.perPage;
    nowPage++;
    url += "&page=" + nowPage;
    //this.setState({ page: nowPage });

    console.log(url);

    console.log(
      "now page:" +
      nowPage +
      " ,in dao is OFFSET " +
      this.state.perPage * (nowPage - 1) +
      " ROWS FETCH NEXT " +
      this.state.perPage +
      " ROWS ONLY"
    );

    await fetch(url)
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
        //this.setState({InvoiceInfos: []});
        throw new Error(msg);
      })
      .then((data) => {
        //let rowNum = Object.keys(data.data).length;

        //新的資料筆數 != 原資料筆數 表示資料有異動,重新從第一筆開始顯示
        //fullCount基本上會是一個固定值 等同perPage,
        //當最後剩兩筆資料時,就不會等於每頁的顯示數量,
        //如符合此狀況代表已讀取到最後一個分頁,所以重置頁數.
        // if (rowNum < this.state.perPage) {
        //   console.log("重置");
        //   //重新從第一筆開始顯示
        //   this.setState({ page: 0 });
        // }

        let tableState = tableRef.current.dataManager.getRenderState();
        //用原table data length 來判斷是否初次讀取資料
        if (tableState.data.length > 0) {
          //如非初次表示可能有作欄位顯示隱藏等套件功能設置
          //這時要保留設定狀態須避免re-render行為發生
          //故使用dataManager.setData給新data
          tableRef.current.dataManager.setData(data.data);
          //將給過新data的table state更新回去,
          //使用table的setState僅re-render table conponent.
          tableState = tableRef.current.dataManager.getRenderState();
          tableRef.current.setState(tableState);
        } else {
          console.log("初次啟動取得資料,更改component state.");
          this.setState({ InvoiceInfos: data });
        }

      })
      .catch((error) => {
        console.log(error.message);
        //alert(error.message);
      });
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
          <title>待檢貨出貨清單</title>

        </Helmet>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <h2>待檢貨出貨清單</h2>
            {
              /*
              <Grid item xs={12} sm={2}>
              日期區間,以當下日期為基準:<br />
                起始:<input size='1' value={this.state.pastDaysCount} onChange={this.handlePastDaysCountChange} type='text'></input>天
                &nbsp;&nbsp;<input size='8' value={this.state.lastMDate} readOnly></input>
              <br />
                結束:<input size='1' value={this.state.futureDaysCount} onChange={this.handleFutureDaysCountChange} type='text'></input>天
                &nbsp;&nbsp;<input size='8' value={this.state.endDate} readOnly></input>
            </Grid>
              */
            }

            <Grid item xs={12} sm={1}>
              <PageChangeDelayNum parentHandlePageChangeDelayNum={this.handlePageChangeDelayNum}></PageChangeDelayNum>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Typography id="discrete-slider" gutterBottom>
                顯示筆數
              </Typography>
              <Slider
                defaultValue={5}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={1}
                marks={marks}
                min={1}
                max={10}
                onChangeCommitted={this.handlePerPage}
              />
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
            pageSizeOptions: [5],//設置一個選項
            rowStyle: (rowData) => {
              let dd = Math.ceil(Math.abs(new Date(rowData.xmdg028) - new Date()) / (1000 * 60 * 60 * 24));
              return ({

                backgroundColor:
                  dd >= 3
                    ? "rgba(59, 216, 63, 0.94)"
                    : dd > 1 && dd <= 2
                      ? "yellow"
                      : dd <= 1 && "pink",
              })

            },

          }}

          icons={tableIcons}
          columns={[
            { title: "出通單號", field: "xmdhdocno" },
            { title: "項次", field: "xmdhseq" },
            { title: "單據日", field: "xmdgdocdt" },
            {
              title: "預計出貨日期",
              field: "xmdg028",
              // type: "date",
              // render: (rowData) => (
              //   <Moment format="YYYY/MM/DD">{rowData.xmdg028}</Moment>
              // ),
            },
            { title: "業務人員", field: "xmdg002" },
            { title: "交易對象簡稱", field: "pmaal004" },
            { title: "訂單單號", field: "xmdh001" },
            { title: "料件編號", field: "xmdh006" },
            { title: "品名", field: "imaal003" },
            { title: "規格", field: "imaal004" },
            { title: "產品特徵", field: "xmdh007" },
            { title: "出貨單位", field: "xmdh015" },
            { title: "實際出通量", field: "xmdh017" },
            { title: "已轉出貨量", field: "xmdh030" },
            {
              title: "未出貨量", field: "notyet", render: (rowData) => {
                return Number(rowData.xmdh017) - Number(rowData.xmdh030);
              }
            },
            {
              title: "出貨率", field: "per",
              render: (rowData) => {
                let total = Number(rowData.xmdh017);
                let num = Number(rowData.xmdh030);
                //let num = total - xmdh030;
                return (Math.round(num / total * 10000) / 100.00 + "%");//小數點後兩位
              }
            },

          ]}

          data={InvoiceInfos.data}
          tableRef={tableRef}
          // other props
          localization={kanbanLocalization}

        />


      </div >
    );
  }
}

export default TobePickedShippingInfoList;
