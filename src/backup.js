import React, { Component } from 'react'
import MaterialTable  ,{ MTableToolbar }from 'material-table'
import tableIcons  from './TableIcons'
import Moment from 'react-moment';
import 'moment-timezone';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import { IconButton,Button } from '@material-ui/core';
import YoutubeSearchedForIcon from '@material-ui/icons/YoutubeSearchedFor';
import { makeStyles } from '@material-ui/core/styles';


class MyComponent extends Component {
  
    constructor(props) {
        super(props);

        let startdate = new Date();
        //設定日期為第一天
        startdate.setDate(1);
        
        startdate = startdate.getFullYear()+"/"+ (startdate.getMonth()+1) + "/"+startdate.getDate();        

        let enddate = new Date();       
        //將月份移至下個月份
        enddate.setMonth(enddate.getMonth()+1);
        //設定為下個月份的第一天
        enddate.setDate(1);
        //將日期-1為當月的最後一天
        enddate.setDate(enddate.getDate()-1);
        enddate = enddate.getFullYear()+"/"+ (enddate.getMonth()+1) + "/"+enddate.getDate();        
        this.state = { 
            InvoiceInfos: [],
            startDate:startdate,
            endDate:enddate,
            downloadUrl:''
        };
  
	}
    downloadExcel=(e)=> {
      
   
     
        // fetch('api/files/20.xlsx')
        // .then(alert("OK"));
    }
  
    //寫入樣板 並產生下載網址
    //目前應該址要更改檔名即可
  exportExcel=(e)=> {
        
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;

        fetch('api/test?start='+startDate+'&end='+endDate)
        .then(response => {
              if(response.ok) {
                response.json();
                alert("完成!");
              }else{
                throw new Error(this.checkResponseStatus(response.status));
              }
              
          } )
        .then(data =>  
          this.setState({
             downloadUrl: 'http://'+data+':8080/api/files/20.xlsx' 
            }) )
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ', error.message);
          alert(error.message);
          });;
    }

    checkResponseStatus=(status)=> {
        let msg = "";
        switch (status) {
          case 500:
          msg = "錯誤碼:"+status+"請檢查 API service server,URL= api/DecathlonInvoiceInfoByDate 來源無回應";
          break;
          case 404:
          msg = "錯誤碼:"+status+"請檢查API URL,可能沒有這個檔案,出現404錯誤";
          break;
          default:
            msg = "錯誤碼:"+status+" 請檢察API URL,出現404錯誤";
            break;
          }
        return msg;
      
    }



    getDecathlonInvoiceInfoByDate=(e)=> {
        
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;

        fetch('api/DecathlonInvoiceInfoByDate?start='+startDate+'&end='+endDate).then(response => 
          
          {
            if(response.ok) {
					
            this.setState({ isLoading:false});
            return response.json();
            }
            let msg = "";
            switch (response.status) {
              case 500:
              msg = "錯誤碼:"+response.status+"請檢查 API service server,URL= api/DecathlonInvoiceInfoByDate 來源無回應";
              break;
              case 404:
              msg = "錯誤碼:"+response.status+"請檢查API URL,可能沒有這個檔案,出現404錯誤";
              break;
              default:
                msg = "錯誤碼:"+response.status+" 請檢察API URL,出現404錯誤";
                break;
				  }

				  throw new Error(msg);})
        .then(data => this.setState({ InvoiceInfos: data }))
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ', error.message);
          alert(error.message);
          });;
    }
    /**
     * KeyboardDatePicker API ref:https://material-ui-pickers.dev/api/KeyboardDatePicker
     * date:預設日期資訊
     * dateValue:格式化後的日期資訊
     */
    handleStartDateChange=(date,dateValue)=>{
        
        this.setState({ startDate:dateValue});

      }

    /**
     * KeyboardDatePicker API ref:https://material-ui-pickers.dev/api/KeyboardDatePicker
     * date:預設日期資訊
     * dateValue:格式化後的日期資訊
    */
      handleEndDateChange=(date,dateValue)=>{
        
        this.setState({ endDate: dateValue });

      }
    
  render() {
    
    const { InvoiceInfos } = this.state;
    return (
      <div style={{ maxWidth: '100%' }}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        
        <KeyboardDatePicker
          margin="normal"
          id="startDatePicker"
          label="開始日期"
          format="yyyy/MM/dd"
          value={this.state.startDate}
          onChange={this.handleStartDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          margin="normal"
          id="endDatePicker"
          label="結束日期"
          format="yyyy/MM/dd"
          value={this.state.endDate}
          onChange={this.handleEndDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={this.getDecathlonInvoiceInfoByDate}
        className={classes.button}
        startIcon={<YoutubeSearchedForIcon />}
      >
        Save
      </Button>
       <IconButton  color="primary" onClick={this.getDecathlonInvoiceInfoByDate}><YoutubeSearchedForIcon />根據輸入日期查詢</IconButton>
       <IconButton  color="primary" onClick={this.exportExcel}><YoutubeSearchedForIcon />匯出excel測試</IconButton>
       <a id="testa" href={this.state.downloadUrl}><YoutubeSearchedForIcon />下載excel測試</a>
       <IconButton  color="primary" onClick={this.exportExcel}><YoutubeSearchedForIcon />匯出pdf測試</IconButton>

      </Grid>
    </MuiPickersUtilsProvider>
        <MaterialTable
        title="發票作業 " 
        options={{
            search: true,
            sorting: true,
            pageSizeOptions: [10,50,100,200],
            tableLayout: 'auto',
            exportButton: true
            
          }}
        icons={tableIcons}
        columns={[
            { title: '發票日', field: 'invoiceDate', render: rowData => <Moment format="YYYY/MM/DD">{rowData.invoiceDate}</Moment>  },
            { title: '訂單號', field: 'orderNum' },
            { title: '品名', field: 'productName'},
            { title: '客戶產品編號', field: 'cusProductNum' },
            { title: '數量', field: 'qty' },
            { title: '單價', field: 'unitPrice'  },
            { title: '帳款單號', field: 'receivableNum' },
            { title: '發票號碼', field: 'invoiceNum' }
          ]}
          data = {InvoiceInfos}
          components={{
            Toolbar: props => (
              <div>
                <MTableToolbar {...props} />
                <div style={{padding: '0px 10px'}}>
                   

                    
                </div>
              </div>
            ),
          }}
        />
      </div>
    )
  }
}

export  default MyComponent;
