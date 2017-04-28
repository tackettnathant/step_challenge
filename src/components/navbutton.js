import React, { Component } from 'react';
import { Link,browserHistory } from 'react-router';
import appHistory from '../apphistory';
class Navbutton extends Component {
    
	navTo(){
		appHistory.push(this.props.route);
	}
	
	render() {
        return (
                <div onClick={this.navTo.bind(this)} className={"column col-4 text-center navbar centered "+(this.props.active===this.props.route?"active":"")} >{this.props.text}</div>
        		)
    }
}

export default Navbutton;