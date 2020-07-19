//使用function component試作動態換頁版本
import React, {  useRef } from "react";

import { IconButton } from "@material-ui/core";

import MaterialTable from "material-table";
import tableIcons from "../TableIcons";



import "moment-timezone";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import YoutubeSearchedForIcon from "@material-ui/icons/YoutubeSearchedFor";
import Spinner from "../components/Spinner";



//增加date方法
Date.prototype.addDays = function (days) {
  this.setDate(this.getDate() + days);
  return this;
}


const getDateByAfterDays = (n) => {
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


export default function CustomPaginationActionsTable() {


  const [page, setPage] = React.useState(0);
  const [futureDaysCount, setFutureDaysCount] = React.useState(0);
  const [pastDaysCount, setPastDaysCount] = React.useState(0);
  const [endDate, setEndDate] = React.useState(getDateByAfterDays(0));
  const [hideRun, setHideRun] = React.useState('');
  const [hideRunning, setHideRunning] = React.useState('none');
  const [lastMDate, setLastMDate] = React.useState(getDateByAfterDays(-7));
  const [InvoiceInfos, setInvoiceInfos] = React.useState([]);
  const [perPage] = React.useState(5);
  const tableRef = useRef(null)
  //給async function中,用await設定sleep時間
  //必須包含在給async中,並在呼叫時冠上await前墜
  const delay = (t) => {
    return new Promise(resolve => {
      //setTimeout(function () {resolve(this.getTobePickedShippingInfoList())},t); 

      setTimeout(resolve, t);

    }).then(onfulfilled => console.log('delay over'))
  }

  /**
   * KeyboardDatePicker API ref:https://material-ui-pickers.dev/api/KeyboardDatePicker
   * date:預設日期資訊
   * dateValue:格式化後的日期資訊
   */
  const handleEndDateChange = (date, dateValue) => {
    setEndDate(dateValue);
  };

  const doInit = async () => {

    setHideRun("none");
    setHideRunning("");

    await getTobePickedShippingInfoList().then(
      () => delay()//設定等待時間
    );

    let pNum = page;
    //迴圈會循序執行邏輯,才會等待
    for (let i = 30; i > 1; i++) {

      await delay(5000);
      console.log(tableRef.current.dataManager.data.length);
      if ((pNum * tableRef.current.dataManager.pageSize) > tableRef.current.dataManager.data.length) {

        pNum = 0;
      }
      tableRef.current.dataManager.changeCurrentPage(pNum);
      setPage(pNum);


      pNum++;


    }



  };

  const handlePastDaysCountChange = (event) => {
    setPastDaysCount(event.target.value);
  }

  const handleFutureDaysCountChange = (event) => {
    setFutureDaysCount(event.target.value);
  }


  //   useEffect(() => {
  //     tableRef.current.dataManager.changePageSize(2)
  // }, [])
  const getTobePickedShippingInfoList = async () => {

    setEndDate(getDateByAfterDays(parseInt(futureDaysCount)));
    setLastMDate(getDateByAfterDays(parseInt(pastDaysCount)));
    console.log('getDateByAfterDays=>' + getDateByAfterDays(parseInt(futureDaysCount)));
    console.log('futureDaysCount=>' + futureDaysCount);
    console.log('pastDaysCount=>' + pastDaysCount);
    await delay(1);//設定等待時間 1000=1秒 需考慮讀取資料時間
    let iendDate = endDate;
    let startDate = lastMDate;

    const date1 = new Date(iendDate);
    const date2 = new Date(startDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffTime + " milliseconds");
    console.log(diffDays + " days");
    console.log(lastMDate);
    console.log(iendDate);


    let nowPage = page;
    let url =
      "kanbanApi/getTobePickedShippingInfoList?expShipEndDate=" + getDateByAfterDays(parseInt(futureDaysCount));
    url += "&expShipStartDate=" + getDateByAfterDays(parseInt(pastDaysCount));
    url += "&per_page=" + perPage;
    nowPage++;
    url += "&page=" + nowPage;
    setPage(nowPage);

    console.log(url);

    console.log(
      "now page:" +
      nowPage +
      " ,in dao is OFFSET " +
      perPage * (nowPage - 1) +
      " ROWS FETCH NEXT " +
      perPage +
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
            setPage(0);
            break;
          case 404:
            msg = "錯誤碼:檢查 請檢察API URL,出現404錯誤";
            break;
          default:
            msg = "錯誤碼:" + response.status + " 請檢察API URL,出現404錯誤";
            break;
        }

        throw new Error(msg);
      })
      .then((data) => {
        let rowNum = Object.keys(data.data).length;

        //新的資料筆數 != 原資料筆數 表示資料有異動,重新從第一筆開始顯示
        //fullCount基本上會是一個固定值 等同perPage,
        //當最後剩兩筆資料時,就不會等於每頁的顯示數量,
        //如符合此狀況代表已讀取到最後一個分頁,所以重置頁數.
        if (rowNum < perPage) {
          console.log("重置");
          //重新從第一筆開始顯示
          setPage(0);
        }

        setInvoiceInfos(data);
      })
      .catch((error) => {
        console.log(error.message);
        //alert(error.message);
      });
  };


  return (
    <div >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <h2>待檢貨出貨清單</h2>
          <Grid item xs={12} sm={2}>

            <KeyboardDatePicker
              margin="normal"
              id="startDatePicker"
              label="預計出貨日取到:"
              format="yyyy-MM-dd"
              value={endDate}
              onChange={handleEndDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            資料範圍,以今日為基準<br />
            起始:<input size='2' value={pastDaysCount} onChange={handlePastDaysCountChange} type='text'></input>天<br />
            結束:<input size='2' value={futureDaysCount} onChange={handleFutureDaysCountChange} type='text'></input>天
            </Grid>


          <Grid item xs={12} sm={2}>
            <div style={{ display: hideRun }}>
              <IconButton color="primary" onClick={doInit}>
                <YoutubeSearchedForIcon />
                  Run
                </IconButton>
            </div>

            <div style={{ display: hideRunning }}>
              <Spinner text="Running...." />
            </div>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
      <MaterialTable
        title=""
        icons={tableIcons}
        options={{
          search: false,
          sorting: true,
          draggable: true,
          tableLayout: "auto",
          exportButton: false,
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

        //取得本元素物件的參考 後續即可使用tableRef來作table控制
        //API https://github.com/mbrn/material-table/blob/master/src/utils/data-manager.js
        tableRef={tableRef}


      />

      {/** 
        //控制 tableRef 的基本方式
        <button
              onClick={() => {
                tableRef.current.dataManager.changeCurrentPage(5)
                setPage(5)
              }}
            >
              5
                </button>
            <button
              onClick={() => {
                tableRef.current.dataManager.changeCurrentPage(4)
                setPage(4)
              }}
            >
              4
            </button>
            <button
              onClick={() => {
                tableRef.current.dataManager.changeCurrentPage(3)
                setPage(3)
              }}
            >
              3
            </button>

            <button
              onClick={() => {
                tableRef.current.dataManager.changePageSize(10)
                setPerPage(10)
              }}
            >
              perpage 10
              </button>
            <button
              onClick={() => {
                tableRef.current.dataManager.changePageSize(5)
                setPerPage(5)
              }}
            >
              perpage 5
              </button>

      */

      }


    </div>

  );
}
