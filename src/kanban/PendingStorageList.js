import React, { Component } from "react";
import MaterialTable from "material-table";
import tableIcons from "../TableIcons";
import Slider from "@material-ui/core/Slider";

import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import "moment-timezone";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  // KeyboardDatePicker,
} from "@material-ui/pickers";
import { Select } from "@material-ui/core";

import DataPerPageMark from "./publicObj/DataPerPageMark";
import KanbanLocalization from "./publicObj/KanbanLocalization";
import KanbanRunner from "./subComponents/KanbanRunner";
import PageChangeDelayNum from "./subComponents/PageChangeDelayNum";
import Funcs from "./util/Funcs";
import { Helmet } from "react-helmet";


const funcs = new Funcs();
const marks = DataPerPageMark;
const tableRef = React.createRef();
const kanbanLocalization = KanbanLocalization;
let pageChangeDelayNum = 5;
let runFlag = true;
/**
 * 一般 待入庫清單 apmr931
 */
class PendingStorageList extends Component {
  constructor(props) {
    super(props);

    //增加date方法
    // eslint-disable-next-line no-extend-native
    Date.prototype.addDays = function (days) {
      this.setDate(this.getDate() + days);
      return this;
    }
    let endDate = this.getDateByAfterDays(3);

    //設定日期為第一天
    //startdate.setDate(1);

    // let lastMDate = this.getOneMonthAgoDate(1);
    let lastMDate = this.getDateByAfterDays(-7);


    this.state = {
      InvoiceInfos: [],
      endDate: endDate,
      isLoading: false,
      perPage: 5,
      page: 0,
      fullCount: 0,
      hideRun: "",
      hideRunning: "none",
      lastMDate: lastMDate,
      pmds000: 1,

    };
  }

  handlePmds000Change = (event) => {
    this.setState({ pmds000: event.target.value });
  };
  getOneMonthAgoDate = (n) => {
    var d = new Date();
    d.setMonth(d.getMonth() - n);
    var month = d.getMonth() + 1;
    var day = d.getDate();

    var output = d.getFullYear() + '/' +
      (month < 10 ? '0' : '') + month + '/' +
      (day < 10 ? '0' : '') + day;
    return output;
  }

  getDateByAfterDays = (n) => {
    var d = new Date();
    // 
    d.addDays(n);
    //d.setMonth(d.getMonth());
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = d.getFullYear() + '/' +
      (month < 10 ? '0' : '') + month + '/' +
      (day < 10 ? '0' : '') + day;
    return output;
  }

  handlePerPage = (event, newValue) => {
    //alert(newValue);
    tableRef.current.dataManager.changePageSize(newValue);
    let tableState = tableRef.current.dataManager.getRenderState();
    tableRef.current.setState(tableState);
  };



  doStop = () => {

    runFlag = false;
    tableRef.current.setState(tableRef.current.dataManager.getRenderState());

  }

  doPageLoop = async () => {
    let pNum = this.state.page;
    //迴圈會循序執行邏輯,才會等待
    for (let i = 30; i > 1; i++) {
      if (!runFlag) {
        break;
      }
      await funcs.delay(pageChangeDelayNum * 1000);
      //console.log(tableRef.current.dataManager.data.length);
      if ((pNum * tableRef.current.dataManager.pageSize) > tableRef.current.dataManager.data.length) {

        //超過可讀取的數量後 重整資料.
        await this.getPendingStorageList().then(
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

  keepGoing = async () => {
    runFlag = true;

    this.doPageLoop();
  }

  doInit = async () => {
    runFlag = true;
    this.setState({ endDate: this.getDateByAfterDays(3) });
    this.setState({ lastMDate: this.getDateByAfterDays(-3) });


    await this.getPendingStorageList().then(
      () => {
        funcs.delay();
      }//設定等待時間

    );
    this.doPageLoop();

  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPendingStorageList = async () => {

    await funcs.delay(0);//設定等待時間 

    let nowPage = this.state.page;
    let url =
      "kanbanApi/getPendingStorageList?ent=100&site=TWVP&dlang=zh_TW";
    url += "&per_page=" + this.state.perPage;
    nowPage++;
    url += "&page=" + nowPage;
    url += "&pmds000=" + this.state.pmds000;
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

          return response.json();
        }
        let msg = "";

        switch (response.status) {
          case 500:
            msg =
              "錯誤碼:500 請檢查 API service server,URL= " +
              url +
              " 來源無回應; 可能是該出貨日期查無資料導致.";
            //this.setState({ page: 0 });
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

        let tableState = tableRef.current.dataManager.getRenderState();

        if (tableState.data.length > 0) {

          tableRef.current.dataManager.changeCurrentPage(0);

          tableRef.current.dataManager.setData(data.data);
          tableState = tableRef.current.dataManager.getRenderState();
          tableRef.current.setState(tableState);
        } else {
          console.log("初次啟動取得資料");
          this.setState({ InvoiceInfos: data });
        }

      })
      .catch((error) => {
        console.log(error.message);
        //alert(error.message);
      });
  };


  /**
   * KeyboardDatePicker API ref:https://material-ui-pickers.dev/api/KeyboardDatePicker
   * date:預設日期資訊
   * dateValue:格式化後的日期資訊
   */
  handleEndDateChange = (date, dateValue) => {
    this.setState({ endDate: dateValue });
  };


  handlePageChangeDelayNum = (value) => {
    pageChangeDelayNum = value;
  }

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
          <title>待入庫清單</title>

        </Helmet>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <Grid item xs={12} sm={2}>
              <h2>待入庫清單</h2>
              <p></p>
              {/*<KeyboardDatePicker
                margin="normal"
                id="startDatePicker"
                label=""
                format="yyyy/MM/dd"
                value={this.state.endDate}
                onChange={this.handleEndDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />*/}
            </Grid>


            <Grid item xs={12} sm={2}>
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
            <Grid item xs={12} sm={2}>
              <PageChangeDelayNum parentHandlePageChangeDelayNum={this.handlePageChangeDelayNum}></PageChangeDelayNum>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Select
                native
                value={this.state.pmds000}
                onChange={this.handlePmds000Change}
                inputProps={{
                  name: 'pmds000'

                }}
              >
                <option value={'1'}>一般</option>
                <option value={'8'}>委外</option>
              </Select>
            </Grid>
            <Grid item xs={12} sm={2}>
              <KanbanRunner parentDoInit={this.doInit} parentDoStop={this.doStop} parentKeepGoing={this.keepGoing}></KanbanRunner>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
        <MaterialTable
          title=""
          tableRef={tableRef}
          // onRowClick={((evt, selectedRow) => this.setState({ selectedRow }))}
          options={{
            doubleHorizontalScroll: true,
            search: false,
            sorting: true,
            columnsButton: true,
            pageSizeOptions: [5],//設置一個選項
            // rowStyle: (rowData) => {
            //   let dd = Math.ceil(Math.abs(new Date(rowData.xmdg028) - new Date()) / (1000 * 60 * 60 * 24));
            //   return ({

            //     backgroundColor:
            //       dd >= 3
            //         ? "rgba(59, 216, 63, 0.94)"
            //         : dd > 1 && dd <= 2
            //           ? "yellow"
            //           : dd <= 1 && "pink",
            //   })

            // },

          }}
          icons={tableIcons}
          columns={[
            { title: "品名", field: "imaal003" },
            { title: "規格", field: "imaal004" },

            {
              title: "單據日期",
              field: "pmdsdocdt",
              type: "date",
              render: (rowData) => (
                <Moment format="YYYY/MM/DD">{rowData.pmdsdocdt}</Moment>
              ),
            },

            { title: '採購單號', field: 'pmdt001' },
            { title: "項次", field: "pmdtseq" },
            { title: "單據性質", field: "pmds000" },
            { title: "來源單號", field: "pmds006" },
            { title: "採購項次", field: "pmdt002" },
            { title: "採購項序", field: "pmdt003" },
            { title: "料件編號", field: "pmdt006" },
            { title: "產品特徵", field: "pmdt007" },

            { title: "單位", field: "pmdt019" },
            { title: "單位說明", field: "pmdt019_desc" },
            { title: "採購性質", field: "pmds011" },
            { title: '採購性質說明', field: 'pmds011_desc' },

            { title: "帳款供應商", field: "pmds008" },
            { title: "帳款供應商簡稱", field: "pmds008_desc" },
            { title: "作業編號", field: "pmdt007_desc" },
            { title: "送貨供應商", field: "pmds009" },
            { title: "送貨供應商說明", field: "pmds009_desc" },

            { title: "採購供應商", field: "pmds007" },
            { title: "採購供應商簡稱", field: "pmds007_desc" },

            { title: "申請部門", field: "pmds003" },
            { title: "申請部門說明", field: "pmds003_desc" },

            //{ title: "庫位", field: "pmdssite" },
            { title: "申請人員", field: "pmds002" },
            { title: "全名", field: "pmds002_desc" },


            { title: "收貨/入庫單單號", field: "pmdsdocno" },
            { title: "收貨/入庫數量", field: "pmdt020" },
            { title: "計價單位", field: "pmdt023" },
            { title: "計價單位說明", field: "pmdt023_desc" },
            { title: "產品分類", field: "imaa009" },
            { title: "產品分類說明", field: "imaa009_desc" },



            { title: "採購分群", field: "imaf141" },
            { title: "採購分群說明", field: "imaf141_desc" },
            { title: "系列", field: "imaa127" },
            { title: "系列說明", field: "imaa127_desc" },
            // { title: "庫位", field: "pmdsent" },
            { title: "計價數量", field: "pmdt024" },
            { title: "允收數量", field: "pmdt053" },
            { title: "已入庫量", field: "pmdt054" },

            { title: "待入庫數量", field: "pmdt053_Pmdt054" },


          ]}
          data={InvoiceInfos.data}
          localization={kanbanLocalization}
        />

      </div>
    );
  }
}

export default PendingStorageList;
