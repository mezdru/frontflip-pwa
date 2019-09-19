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
          default:
            return;
        }
      }, 5);    
    }

    resetScroll = (scrollContainerId) => {
      var element = window.document.getElementById(scrollContainerId);
      if(element) element.scrollLeft = 0;
    }

    scrollStop = () => {
      clearInterval(interval);
    }

    render() {
      return (
        <ComponentToWrap {...this.props} 
          scrollTo={this.scrollTo}
          scrollStop={this.scrollStop}
          resetScroll={this.resetScroll}
        />
      )
    }
  }

  return ScrollManagement;
}
export default withScrollManagement;