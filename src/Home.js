import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import MyNavbar from './MyNavbar';
//import MyCard from './MyCard';
//import MyCarousel from './MyCarousel';
//import Rechart from './Rechart';
import DecathlonInvoiceExport from './DecathlonInvoiceExport.js';

class Home extends Component {

    render() {
        return (
            
            <div>
                <MyNavbar />
                <DecathlonInvoiceExport />
               
            </div>
        );
    }

}
/**
 *  <Rechart />
    <MyCarousel />
    <MyCard />
 */
export default Home;