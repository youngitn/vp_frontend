import React, { Component } from 'react';
import {
    Collapse,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink
} from 'reactstrap';
import {
    BrowserRouter
} from 'react-router-dom';
import logo from './logo.svg';

class MyNavbar extends Component {
    constructor(props) {
        super();
        this.state = {
            collapse: true
        };
        this.toogleNavbar = this.toogleNavbar.bind(this);
    }

    toogleNavbar() {
        this.setState({
            collapse: !this.state.collapse
        });
    }

    render() {
        return (
            <Navbar color="dark" dark>
                <NavbarBrand href="/" className="mr-auto">
                    <img
                        alt=""
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />
                    {' VP'}
                </NavbarBrand>

                <NavbarToggler onClick={this.toogleNavbar} className="mr-2" />
                <Collapse isOpen={!this.state.collapse} navbar>
                    <Nav className="ml-auto" navbar>
                        <BrowserRouter>
                            <NavItem>
                                <NavLink href="/">迪卡儂發票匯出作業</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/TobePickedShippingInfoList">待檢貨出貨清單</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/PendingStorageList">待入庫清單</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/MateriaPrepareList">備料清單</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/WorkOrderProductionScheduleList">工單生產進度</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/WorkOrderProductionScheduleListByArea">產線區域工單生產排程清單</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/MES">MES</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/USDV">優適達報表</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/TodayShipInfoList">今日已建出貨單列表</NavLink>
                            </NavItem>
                            {/*<NavItem>
                                 <NavLink href="/Demo">demo</NavLink>
                            </NavItem>*/}
                        </BrowserRouter>
                    </Nav>
                </Collapse>

            </Navbar >
        );
    }
}

export default MyNavbar;