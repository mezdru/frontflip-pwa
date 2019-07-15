import React, { Component } from "react";

let interval;

const withScrollManagement = (ComponentToWrap) => {
  class ScrollManagement extends Component {

    scrollTo = (scrollDirection, scrollContainerId) => {
      interval = window.setInterval(function () {
        var element = window.document.getElementById(scrollContainerId);
        switch(scrollDirection) {
          case "left":
            element.scrollLeft += 2;
            break;
          case "right":
            element.scrollLeft -= 2;
            break;
        }
      }.bind(this), 5);    
    }

    scrollStop = () => {
      clearInterval(interval);
    }

    render() {
      return (
        <ComponentToWrap {...this.props} 
          scrollTo={this.scrollTo}
          scrollStop={this.scrollStop}
        />
      )
    }
  }

  return ScrollManagement;
}
export default withScrollManagement;