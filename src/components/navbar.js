import React, { Component } from 'react';
import Navbutton from './navbutton';
class Navbar extends Component {
    render() {
        return (
                <div className="columns">
                <Navbutton route={"/"} text={"Home"} active={this.props.active} />
                <Navbutton route={"dashboard"} text={"My Steps"} active={this.props.active} />
                <Navbutton route={"leaderboard"} text={"Leader Board"} active={this.props.active}/>
                </div>       		
        		
        		)
    }
}

export default Navbar;