import React, {useState} from 'react'
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
import { Button,IconButton,Collapse ,Select} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import YoutubeSearchedForIcon from '@material-ui/icons/YoutubeSearchedFor';
import { makeStyles } from '@material-ui/core/styles';
import {Alert, AlertTitle } from '@material-ui/lab';
import { useWait} from "react-wait";
import Spinner from "./components/Spinner";


const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));



const MyComponent = (props) =>{
  const classes = useStyles();
  
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

  const [startDate,setStartDate] = useState(startdate);
  const [InvoiceInfos,setInvoiceInfos] = useState([]);
  const [endDate,setEndDate] = useState(enddate);
  const [downloadExcelUrl,setDownloadExcelUrl] = useState('');
  const [downloadPdfUrl,setDownloadPdfUrl] = useState('');
  const [open, setOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const { startWaiting, endWaiting, Wait } = useWait();
  const [cusNo, setCusNo] = useState('065D001');
  const checkResponseStatus=(status)=> {
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

const getDecathlonInvoiceInfoByDate=(e)=> {
        
  fetch('api/DecathlonInvoiceInfoByDate?start=' + startDate + '&end=' + endDate + '&cusNo='+ cusNo).then(response => 
    {
      if(response.ok) {
        return response.json();
      }
      throw new Error(checkResponseStatus(response.status));
    })
  .then(data => {
    var count = Object.keys(data).length;
    if (count === 0){
      alert("查無資料");
    }
    setInvoiceInfos(data);
    console.log(data)
    
    
  })
  .catch(function(error) {
    console.log('There has been a problem with your fetch operation: ', error.message+' startDate=>'+startDate+'  enddate:'+endDate);
    alert(error.message);
    });;
}

const handleStartDateChange=(date,dateValue)=>{
        
  setStartDate(dateValue);

}

const handleEndDateChange=(date,dateValue)=>{
        
  setEndDate(dateValue);

}

const handleChange = (event) => {
  const cNo = event.target.value;
  alert(cNo);
  setCusNo(cNo);
};

const exportExcel=(e)=> {
  setOpen(true);      
  startWaiting("excel wait");
  fetch('api/DataToExcel?start='+startDate+'&end='+endDate + '&cusNo='+ cusNo)
  .then(response => {
        if(response.ok) {
          endWaiting("excel wait");
          
          return response.json();
        }else{
          throw new Error(this.checkResponseStatus(response.status));
        }
        
    } )
  .then((data) => {
    if(data == 'NoData'){ //eslint-disable-line 
      setDownloadExcelUrl("無資料產生");
    }else{
      setDownloadExcelUrl(<a  href={data}>下載excel</a>);
      console.log(data);
      setOpen(true)
    }
    
  })
  .catch(function(error) {
    console.log('There has been a problem with your fetch operation: ', error.message);
    alert(error.message);
    });
}

const exportPdf=(e)=> {
  setPdfOpen(true);
  startWaiting("pdf wait");
  fetch('api/DataToPdf?start='+startDate+'&end='+endDate+ '&cusNo='+ cusNo)
  .then(response => {
        if(response.ok) {
          endWaiting("pdf wait");
          
          return response.json();
        }else{
          
          throw new Error(this.checkResponseStatus(response.status));
        }
        
    } )
  .then((data) => {
    if(data == 'NoData'){ //eslint-disable-line 
      setDownloadPdfUrl("無資料產生");
     
    }else{
      setDownloadPdfUrl(<a  href={data}>下載pdf</a>);
      console.log(data);
      setPdfOpen(true)
    }
  })
  .catch(function(error) {
    console.log('There has been a problem with your fetch operation: ', error.message);
    alert(error.message);
    });;
}
  return (
    
    <div style={{ maxWidth: '100%' }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          
      <Grid container justify="center">
      <Grid container spacing={1} alignItems="center" justify="center">
        <Grid item xs={12} sm={2}>
            <KeyboardDatePicker
              margin="normal"
              id="startDatePicker"
              label="開始日期"
              format="yyyy/MM/dd"
              value={startDate}
              onChange={handleStartDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
        </Grid>
        <Grid item xs={12} sm={2}>
          <KeyboardDatePicker
            margin="normal"
            id="endDatePicker"
            label="結束日期"
            format="yyyy/MM/dd"
            value={endDate}
            onChange={handleEndDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Select
            native
            value={cusNo}
            onChange={handleChange}
            inputProps={{
              name: 'cusNo'
            
            }}
          >
            <option value={'K0064'}>內銷</option>
            <option value={'065D001'}>外銷</option>
          </Select>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={getDecathlonInvoiceInfoByDate}
            className={classes.button}
            startIcon={<YoutubeSearchedForIcon />}
            >
            查詢
          </Button>
        </Grid> 
        
        <Grid item xs={12} sm={2}>
           
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={exportExcel}
            className={classes.button}
            startIcon={<YoutubeSearchedForIcon />}
          >
            匯出excel
          </Button>
          <Collapse in={open}>
      <Alert  severity="info" className="message"
      
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
         <Wait on="excel wait" fallback={<Spinner/>} ><AlertTitle>{downloadExcelUrl}</AlertTitle></Wait>
        </Alert>
        </Collapse>
           
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={exportPdf}
            className={classes.button}
            startIcon={<YoutubeSearchedForIcon />}
          >
            匯出pdf
          </Button>
           
            <Collapse in={pdfOpen}>
            <Alert  severity="info" className="message"
        
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setPdfOpen(false);
                  }}
                >
                  
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
            <Wait on="pdf wait" fallback={<Spinner/>}><AlertTitle>{downloadPdfUrl}</AlertTitle></Wait>
          
          </Alert>
          </Collapse>
          </Grid>
      </Grid>
        
      
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

  );
}
export default MyComponent;
