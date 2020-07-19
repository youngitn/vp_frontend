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
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { IconButton, Select } from "@material-ui/core";
import YoutubeSearchedForIcon from "@material-ui/icons/YoutubeSearchedFor";

import Spinner from "../components/Spinner";
import DataPerPageMark from "./publicObj/DataPerPageMark";
import WorkOrderStusCodeMap from "./publicObj/WorkOrderStusCodeMap";
const marks = DataPerPageMark;

/**
 * 一般 待入庫清單 apmr931
 */
class MateriaPrepareList_backup extends Component {
  constructor(props) {
    super(props);

    //增加date方法
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
      stus:'Y'

    };
  }

  handleStusChange = (event) => {
    this.setState({stus:event.target.value});
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


  //給async function中,用await設定sleep時間
  //必須包含在給async中,並在呼叫時冠上await前墜
  delay = (t) => {
    return new Promise(resolve => {
      //setTimeout(function () {resolve(this.getTobePickedShippingInfoList())},t); 

      setTimeout(resolve, t);

    }).then(onfulfilled => console.log('delay over'))
  }
  doInit = async () => {
    this.setState({ hideRun: "none" });
    this.setState({ hideRunning: "" });
  
    //迴圈會循序執行邏輯,才會等待
    for (let i = 30; i > 1; i++) {
      await this.getPendingStorageList().then(
        () => this.delay()//設定等待時間
      );

    }

  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPendingStorageList = async () => {
    // console.log("預設lastMDate=>"+this.state.lastMDate);
    // this.setState({ endDate: this.getDateByAfterDays(3) });
    // this.setState({ lastMDate: this.getDateByAfterDays(-3) });

    await this.delay(6000);//設定等待時間
    let endDate = this.state.endDate;
    let startDate = this.state.lastMDate;

    const date1 = new Date(endDate);
    const date2 = new Date(startDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffTime + " milliseconds");
    console.log(diffDays + " days");
    console.log(this.state.lastMDate);
    console.log(this.state.endDate);


    let nowPage = this.state.page;
    let url =
      "kanbanApi/getMateriaPrepareList?site=TWVP";
    url += "&per_page=" + this.state.perPage;
    nowPage++;
    url += "&page=" + nowPage;
    url += "&stus=" + this.state.stus;
    url += "&sfaa019=" + this.state.endDate;
    this.setState({ page: nowPage });
    console.log('sfaa019==='+this.state.endDate);
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
          this.setState({ isLoading: false });
          
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
        let rowNum = Object.keys(data.data).length;

        //新的資料筆數 != 原資料筆數 表示資料有異動,重新從第一筆開始顯示
        //fullCount基本上會是一個固定值 等同perPage,
        //當最後剩兩筆資料時,就不會等於每頁的顯示數量,
        //如符合此狀況代表已讀取到最後一個分頁,所以重置頁數.
        if (rowNum < this.state.perPage) {
          console.log("重置");
          //重新從第一筆開始顯示
          this.setState({ page: 0 });
        }

        this.setState({ InvoiceInfos: data });
      })
      .catch((error) => {
        console.log(error.message);
        //alert(error.message);
      });
  };

  handlePerPage = (event, newValue) => {
    //alert(newValue);
    this.setState({ perPage: newValue });
  };


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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
          <h2>備料清單</h2>
            <Grid item xs={12} sm={2}>
              <KeyboardDatePicker
                margin="normal"
                id="startDatePicker"
                label="預計開工日大於等於該日期:"
                format="yyyy/MM/dd"
                value={this.state.endDate}
                onChange={this.handleEndDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
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
             狀態: 
            <Select
                native
                value={this.state.stus}
                onChange={this.handleStusChange}
                inputProps={{
                  name: 'stus'

                }}
              >
                <option value={'A'}>已核准</option>
                <option value={'C'}>結案</option>
                <option value={'D'}>抽單</option>
                <option value={'F'}>已發出</option>
                <option value={'M'}>成本結案</option>
                <option value={'N'}>未確認</option>
                <option value={'R'}>已拒絕</option>
                <option value={'W'}>送簽中</option>
                <option value={'X'}>作廢</option>
                <option value={'Y'}>已確認</option>
              </Select>
            </Grid>
            <Grid item xs={12} sm={2}>
              <div style={{ display: this.state.hideRun }}>
                <IconButton color="primary" onClick={this.doInit}>
                  <YoutubeSearchedForIcon />
                  Run
                </IconButton>
              </div>
              <div style={{ display: this.state.hideRunning }}>
                <Spinner text="Running...." />
              </div>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
        <MaterialTable
          title="備料清單"
          // onRowClick={((evt, selectedRow) => this.setState({ selectedRow }))}
          options={{
            search: false,
            sorting: true,
            pageSize: 10,
            draggable: true,
            tableLayout: "auto",
            exportButton: false,
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
            { title: "狀態", field: "sfaastus" ,render: (rowData) =>{
              return WorkOrderStusCodeMap.get(rowData.sfaastus);
            }},
            { title: "工單", field: "sfaadocno" },
            
            {
              title: "預計開工日",
              field: "sfaa019",
              type: "date",
              render: (rowData) => (
                <Moment format="YYYY/MM/DD">{rowData.sfaa019}</Moment>
              ),
            },
            { title: "項次", field: "sfbaseq" },
            { title: "品名", field: "imaal003" },
            { title: "規格", field: "imaal004" },
            { title: "補給策略", field: "imaf013" },
            { title: "BOM料號", field: "sfba005" },
            { title: "發料料號", field: "sfba006" },

            { title: "應發數量", field: "sfba013" },
            { title: "已發數量", field: "sfba016" },
            { title: "未發數量", field: "diff" ,
              render: (rowdata) =>{
                return rowdata.sfba013-rowdata.sfba016;
              }},
            { title: "單位", field: "sfba014" },
            

          ]}
          data={InvoiceInfos.data}

         
        />
      </div>
    );
  }
}

export default MateriaPrepareList_backup;
