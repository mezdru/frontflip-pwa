import React from 'react';
import './Toggle.css';


class Toggle extends React.Component {
    
    render() {
        
        return (
            <div id="userStatusToggle" class={`menu-status-${this.props.state.current}`}>
                <a  title={this.props.state.left} class="u" onClick={this.props.action.left}>
                </a>
                <a  title={this.props.state.middle} class="n"onClick={this.props.action.middle}></a>
                <a  title={this.props.state.right} class="a" onClick={this.props.action.right}>
                </a>
                <div></div>
            </div>
        );
    }
}

export default (Toggle);
