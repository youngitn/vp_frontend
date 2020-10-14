import React, { Component } from "react";
import MaterialTable from "material-table";


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
import { Select, TextField } from '@material-ui/core';
import { Helmet } from "react-helmet";
import Funcs from "./util/Funcs";
import MyNavbar from '../MyNavbar';
const funcs = new Funcs();


const tableRef = React.createRef();
const kanbanLocalization = KanbanLocalization;

let pmc = [
    '',
    '2NC -07',
    '2NC -20',
    '2NC-17',
    '2NC17',
    '2NC-18',
    '2-NC-18v',
    '2NC-11',
    '2222NC -18',
    '2NC -10',
    '2nc -18',
    '2NC 18',
    '2NC -19',
    '2N-07',
    '2NC -08',
    '2NC-19',
    '1-1',
    '2NC -06',
    '2NC -11',
    '2N-08',
    '2F-11',

    '2NC-07',
    'N2NC -19',
    '2NC-06',
    '2NC--06',
    '2NC-08',
    '2NC -09',
    '2NC  -19',
    '2NC-20',
    '2NC-09',
    '2nc -17',
    '2N-06',
    '2N C-17',
];



class Usdv extends Component {

    constructor(props) {
        super();

        this.state = {
            data: [],
            Emp_code: '',//量測人員
            ProMachine_Code: '',//生產機台編號
            Box_Code: '',//生產機台編號
        };


    }





    handleGetData = () => {
        let p = '';
        let mm = '';


        if (this.state.Emp_code !== '') {
            p = p + mm + 'Emp_code=' + this.state.Emp_code;
            mm = '&'
        }
        console.log('----->1' + p)

        if (this.state.ProMachine_Code !== '') {
            p = p + mm + 'ProMachine_Code=' + this.state.ProMachine_Code;
            mm = '&'
        }

        if (this.state.Box_Code !== '') {
            p = p + mm + 'Box_Code=' + this.state.Box_Code;
            mm = '&'
        }
        console.log('----->2' + p)
        if (p !== '') {
            p = '?' + p;
        }
        console.log('----->3' + p)
        var that = this;
        axios.get('/kanbanApi/getMeasureDataList' + p)
            .then(function (response) {
                that.handleData(response.data);
                // handle success
                console.log(response.data);
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
                    <title>USDV</title>

                </Helmet>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">



                        <Grid item sm={12} md={2}>
                            量測人員:<TextField value={this.state.Emp_code} onChange={this.handleEmpCode}></TextField>
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
                            桶號:<TextField value={this.state.Box_Code} onChange={this.handleBoxCode}></TextField>
                        </Grid>
                        <Grid item md={2} sm={12}>
                            生產機台編號:<TextField value={this.state.ProMachine_Code} onChange={this.handleProMachineCode}></TextField>
                        </Grid>

                        <Grid>
                            <button onClick={this.handleGetData}>查詢</button>
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
                        { title: "流水號", field: "serialNo" },
                        { title: "桶號", field: "box_Code" },
                        { title: "量測人員代碼", field: "emp_code" },
                        { title: "生產機台編號", field: "proMachine_Code" },
                        { title: "腳本名稱", field: "template" },
                        { title: "腳本更新日期", field: "updateTime" },
                        { title: "執行量測時間", field: "measureTime" },
                        { title: "腳本量測時間", field: "timestamp" },
                        { title: "ControlItem之量測項目", field: "name" },
                        { title: "量測上限", field: "usl" },
                        { title: "量測下限", field: "lsl" },
                        { title: "量測值", field: "value" },
                        { title: "量測結果", field: "quality" },
                        { title: "資料建立日期", field: "createDateTime" },



                    ]}

                    data={this.state.data}
                    tableRef={data}
                    // other props
                    localization={kanbanLocalization}

                />


            </div >
        );
    }
}

export default Usdv;
