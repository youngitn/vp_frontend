import React, { Component } from "react";


import "moment-timezone";









class DateRangeController extends Component {
    constructor(props) {
        super(props);
        
        console.log('HHHHHHHHH');
        
        this.state = {
            pageChangeDelayNum: 5

        };
    }
    // componentDidMount = () => {
    //     this.run();
    // }
    delay = (t) => {
        return new Promise(resolve => {
          //setTimeout(function () {resolve(this.getTobePickedShippingInfoList())},t); 
    
          setTimeout(resolve, t);
    
        }).then(onfulfilled => console.log('delay over'))
      }
    
    run = async () => {

        for (let i = 1; i > 0; i++){
            await this.delay(3000);
            console.log('HHHHHHHHH');
        }
        
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
            {
            //     日期區間,以當下日期為基準:<br />
            //     起始:<input size='1' value={this.state.pastDaysCount} onChange={this.handlePastDaysCountChange} type='text'></input>天
            //     &nbsp;&nbsp;<input size='8' value={this.state.lastMDate} readOnly></input>
            //     <br />
            //     結束:<input size='1' value={this.state.futureDaysCount} onChange={this.handleFutureDaysCountChange} type='text'></input>天
            //     &nbsp;&nbsp;<input size='8' value={this.state.endDate} readOnly></input>
            }
            </div >
        );
    }
}

export default DateRangeController;
