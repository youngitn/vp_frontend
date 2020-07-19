import React, { Component } from "react";


import "moment-timezone";

import Grid from "@material-ui/core/Grid";
import { IconButton } from "@material-ui/core";
import YoutubeSearchedForIcon from "@material-ui/icons/YoutubeSearchedFor";
import PanToolIcon from '@material-ui/icons/PanTool';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Spinner from "../../components/Spinner";
import Funcs from "../util/Funcs";


class KanbanRunnerWithDateRangeController extends Component {
    funcs = new Funcs();
    sdate = null;
    edate = null;
    constructor(props) {
        super(props);




        this.state = {
            InvoiceInfos: [],
            hideRun: '',
            hideStop: 'none',
            hideRunning: 'none',
            keepGoing: 'none',
            isLoading: false,
            perPage: 5,
            fullCount: 0,
            endDate: new Date(),
            lastMDate: new Date(),
            pastDaysCount: '-1', //要輸入負數才會符合期望功能 -1=過去一天
            futureDaysCount: '1',//1=未來一天
            flag: false,
            page: 0,
            pageChangeDelayNum: 5

        };
    }

    /**
     *先放值到this state中
     *
     * @memberof KanbanRunnerWithDateRangeController
     */
    componentDidMount = () => {
        this.setState(
            function (state) {
                return {
                    endDate: this.funcs.getDateByAfterDays(parseInt(state.futureDaysCount)),
                    lastMDate: this.funcs.getDateByAfterDays(parseInt(state.pastDaysCount))
                }
            }

        );
        

    }

    /**
     *更新當前日期並執行父元素涵數進行日期修改
     *
     * @memberof KanbanRunnerWithDateRangeController
     */
    setDateToParent = (type) => {
        let sdCount = parseInt(this.state.pastDaysCount);
        let edCount = parseInt(this.state.futureDaysCount);

        if (type == 'test') {
            sdCount = 0;
            edCount = 0;
        }
        this.sdate = this.funcs.getDateByAfterDays(sdCount);
        this.edate = this.funcs.getDateByAfterDays(edCount);
        this.changeParentSdate(this.sdate);
        this.changeParentEdate(this.edate);
        this.setState({

            pastDaysCount: sdCount,
            lastMDate: this.sdate,
            futureDaysCount: edCount,
            endDate: this.edate,

        });
    }


    /**
     *
     *
     * @memberof KanbanRunnerWithDateRangeController
     */
    run = async () => {

        for (let i = 1; i < 10; i++) {
            await this.funcs.delay(3600000);
            console.log('更新日期');
            this.setDateToParent();

            i = 1;
        }

    }


    changeParentSdate = (date) => {
        this.props.parentHandlePastDaysCountChangeByValue(date);

    }
    changeParentEdate = (date) => {

        this.props.parentHandleFutureDaysCountChangeByValue(date);
    }

    handlePastDaysCountChange = (event) => {
        this.setState({

            pastDaysCount: event.target.value,
            lastMDate: this.funcs.getDateByAfterDays(parseInt(event.target.value))

        });
        this.sdate = this.funcs.getDateByAfterDays(parseInt(event.target.value));
        this.changeParentSdate(this.sdate);
    }



    handleFutureDaysCountChange = (event) => {
        this.setState({

            futureDaysCount: event.target.value,
            endDate: this.funcs.getDateByAfterDays(parseInt(event.target.value))

        });
        this.edate = this.funcs.getDateByAfterDays(parseInt(event.target.value));
        this.changeParentEdate(this.edate);
    }

    doStop = () => {
        this.setState({
            keepGoing: '',
            hideStop: 'none',
            hideRunning: 'none'
        });
        this.props.parentDoStop();

    }

    doInit = () => {
        this.setState({
            hideRun: 'none',
            hideStop: '',
            hideRunning: ''
        });
        // 更新當前日期並執行父元素涵數進行日期修改
        this.setDateToParent();
        //啟動日期更新功能,因實際更新可能是一小時一次,所以this.setDateToParent()需先執行一次
        this.run();
        this.props.parentDoInit();
        

    }

    keepGoing = () => {
        this.setState({
            hideRun: 'none',
            keepGoing: 'none',
            hideStop: '',
            hideRunning: ''
        });

        this.props.parentKeepGoing();

    }

    render() {

        return (
            <div>
                <div style={{ float: "left", marginRight: "30px", marginLeft: "30px" }}>
                    日期區間,以當下日期為基準:<br />
                起始:<input size='1' value={this.state.pastDaysCount} onChange={this.handlePastDaysCountChange} type='text'></input>天
                &nbsp;&nbsp;<input size='8' value={this.state.lastMDate} readOnly></input>
                    <br />
                結束:<input size='1' value={this.state.futureDaysCount} onChange={this.handleFutureDaysCountChange} type='text'></input>天
                &nbsp;&nbsp;<input size='8' value={this.state.endDate} readOnly></input>
                </div>

                <div style={{ float: "left" }}>

                    <div style={{ display: this.state.hideRun }}>
                        <IconButton color="primary" onClick={this.doInit}>
                            <YoutubeSearchedForIcon />
                  Run
                </IconButton>
                    </div>
                    <div style={{ display: this.state.hideStop }}>
                        <IconButton color="primary" onClick={this.doStop}>
                            <PanToolIcon />
                    Stop
                </IconButton>
                    </div>
                    <div style={{ display: this.state.hideRunning }}>
                        <Spinner text="Running...." />
                    </div>
                    <div style={{ display: this.state.keepGoing }}>
                        <IconButton color="primary" onClick={this.keepGoing}>
                            <PlayArrowIcon />
                        keepGoing
                </IconButton>
                    </div>
                </div>

            </div>
        );
    }
}

export default KanbanRunnerWithDateRangeController;
