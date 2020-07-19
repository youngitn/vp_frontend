import React, { Component } from "react";


import "moment-timezone";









class PageChangeDelayNum extends Component {
    constructor(props) {
        super(props);



        this.state = {
            pageChangeDelayNum: 5

        };
    }



    doStop = () => {
        this.setState({ keepGoing: '' });
        this.setState({ hideStop: 'none' });
        this.setState({ hideRunning: 'none' });
        this.props.parentDoStop();

    }
    handlePageChangeDelayNum = (event) => {
        this.setState({ pageChangeDelayNum: parseInt(event.target.value, 10) })
        this.props.parentHandlePageChangeDelayNum(event.target.value);
    }

    render() {

        return (
            <div >
                頁面停留時間<br />
                <input size='2' value={this.state.pageChangeDelayNum} onChange={this.handlePageChangeDelayNum} type='text'></input>單位:秒<br />

            </div >
        );
    }
}

export default PageChangeDelayNum;
