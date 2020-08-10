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
    BrowserRouter,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import logo from './logo.svg';

class MyNavbar extends Component {
    constructor(props) {
        super(props);
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
                                <NavLink href="/">首頁</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/TobePickedShippingInfoList">TobePickedShippingInfoList</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/PendingStorageList">PendingStorageList</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/MateriaPrepareList">MateriaPrepareList</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/WorkOrderProductionScheduleList">WorkOrderProductionScheduleList</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/MES">MES</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/Demo">demo</NavLink>
                            </NavItem>
                        </BrowserRouter>
                    </Nav>
                </Collapse>

            </Navbar >
        );
    }
}

export default MyNavbar;