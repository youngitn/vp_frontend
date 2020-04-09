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
import { IconButton } from '@material-ui/core';
import YoutubeSearchedForIcon from '@material-ui/icons/YoutubeSearchedFor';

class Members extends Component {
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
			isLoading:false
        };
  
	}

	

    
    getDecathlonInvoiceInfoByDate=(e)=> {
        
        const startDate = this.state.startDate;
		const endDate = this.state.endDate;
		
		//code before the pause
		
		fetch('api/DecathlonInvoiceInfoByDate?start='+startDate+'&end='+endDate)
			.then(response => {
				//response.json()
				if(response.ok) {
					
					this.setState({ isLoading:false});
					return response.json();
				  }
				  let msg = "";
				  switch (response.status) {
					  case 500:
						msg = "錯誤碼:500 請檢查 API service server,URL= api/DecathlonInvoiceInfoByDate 來源無回應";
						break;
					  case 404:
						msg = "錯誤碼:404 請檢察API URL,出現404錯誤";
						break;
					  default:
              msg = "錯誤碼:"+response.status+" 請檢察API URL,出現404錯誤";
						  break;
				  }

				  throw new Error(msg);
			})
			.then(
				data=> this.setState({ InvoiceInfos: data }))
			.catch(function(error) {
        console.log(error.message);
        alert(error.message);
			  });
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
       <IconButton  color="primary" onClick={this.getDecathlonInvoiceInfoByDate}><YoutubeSearchedForIcon />根據輸入日期查詢</IconButton>
      </Grid> 
    </MuiPickersUtilsProvider>
        <MaterialTable
		title="" 
		
		onRowClick={((evt, selectedRow) => this.setState({ selectedRow }))}
		options={{
            search: false,
            sorting: true,
            pageSizeOptions: [10,50,100,200],
            tableLayout: 'auto',
			exportButton: false,
			rowStyle: rowData => (
				
				{
				backgroundColor: rowData.qty <= 100 ?  'yellow': rowData.qty >100 && rowData.qty<= 700 ? 'rgba(59, 216, 63, 0.94)' : rowData.qty >700 && 'pink'
			  }
			  )
            
          }}
        icons={tableIcons}
        columns={[
            { title: '訂單日期', field: 'orderDate',type:'date', render: rowData => <Moment format="YYYY/MM/DD">{rowData.invoiceDate}</Moment>  },
            { title: '訂單號', field: 'orderNum' },
            { title: '品名', field: 'productName'},
            { title: '客戶產品編號', field: 'cusProductNum' },
            { title: '數量', field: 'qty' , type: 'numeric'},
            { title: '單價', field: 'unitPrice', type: 'numeric'  },
            
            
          ]}
		  data = {InvoiceInfos}
		  
		  isLoading = {this.state.isLoading}

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

export  default Members;
