import React, { Component } from 'react';
import '../css/spectre.min.css';
import '../layout.css';
import './header.css';

class Header extends Component {
    render(){
        return(
            <div className="columns">
                <div className="column col-12 text-center headerRow">
                    <h5>Rock Valley Step Challenge</h5>
                </div>
            </div>
        );
    }
}
export default Header;
