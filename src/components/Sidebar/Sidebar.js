import React, { Component } from 'react';
import Icon from './Icon/Icon';
import './Sidebar.css';
import Logo from '../../../src/x.png';
import Pic from '../../../src/man.png';
import Dexpert from '../../../src/images/dexpert.svg';
import Avatar from '../../images/avatar.svg';
import Monitors from '../../images/monitors.svg';

import { Link, NavLink } from 'react-router-dom';

class Sidebar extends Component {

    render() {
        // let activeClassName = this.state.active ? " active" : "";
        return (
            <div className="sidebar">
                <Link to={"/profile/"} > <img className="logo" src={Logo} alt="logo" /></Link>
                <NavLink to={"/projects/"} activeClassName={"sidebarActive"}>
                    {/* <Icon
                    icon="fa-folder-open"
                    // onActive="fa-close"
                    // Activate={this.Activate} 
                    title="Dexperts"
                    // active={this.state.active}
                     /> */}
                    <div className={"sidebar-div"}><div className={"sidebar-div-inner"}><img src={Dexpert} className="icons-side" /></div></div>
                </NavLink>
                <NavLink to={"/employees/"} activeClassName={"sidebarActive"}>
                    <div className={"sidebar-div"}><div className={"sidebar-div-inner"}><img src={Monitors} className="icons-side" /></div></div>
                </NavLink>
                <Link to={"/profile/"} > <img className="pic" title="Profile" src={Avatar} alt="logo" /></Link>
            </div>
        )
    }
}
export default Sidebar;