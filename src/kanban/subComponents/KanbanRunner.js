import React, { Component } from "react";


import "moment-timezone";

import Grid from "@material-ui/core/Grid";
import { IconButton } from "@material-ui/core";
import YoutubeSearchedForIcon from "@material-ui/icons/YoutubeSearchedFor";
import PanToolIcon from '@material-ui/icons/PanTool';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Spinner from "../../components/Spinner";
import Funcs from "../util/Funcs";








class KanbanRunner extends Component {
    funcs = new Funcs();
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

            pastDaysCount: '-1', //要輸入負數才會符合期望功能 -1=過去一天
            futureDaysCount: '1',//1=未來一天
            flag: false,
            page: 0,
            pageChangeDelayNum: 5

        };
    }

    run = async () => {

        for (let i = 1; i < 10; i++) {
            await this.funcs.delay(3000);
            console.log('更新日期');
            // this.props.parentHandlePastDaysCountChangeByValue(i);
            // this.props.parentHandleFutureDaysCountChangeByValue(i);
            i++;
        }

    }

    doStop = () => {
        this.setState({ keepGoing: '' });
        this.setState({ hideStop: 'none' });
        this.setState({ hideRunning: 'none' });
        this.props.parentDoStop();

    }

    doInit = () => {
        this.setState({ hideRun: 'none' });
        this.setState({ hideStop: '' });
        this.setState({ hideRunning: '' });
        this.props.parentDoInit();
        this.run();

    }

    keepGoing = () => {
        this.setState({ hideRun: 'none' });
        this.setState({ keepGoing: 'none' });
        this.setState({ hideStop: '' });
        this.setState({ hideRunning: '' });

        this.props.parentKeepGoing();

    }

    render() {

        return (
            <div>


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
        );
    }
}

export default KanbanRunner;
