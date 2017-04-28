import React, { Component } from 'react';
import Navbutton from './navbutton';
class AdminNavbar extends Component {
    render() {
        return (
                <div className="columns">
                <Navbutton route={"admin"} text={"Settings"} active={this.props.active} />
                <Navbutton route={"locations"} text={"Locations"} active={this.props.active} />
                <Navbutton route={"users"} text={"Users"} active={this.props.active}/>
                </div>       		
        		
        		)
    }
}

export default AdminNavbar;