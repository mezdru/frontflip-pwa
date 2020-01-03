import React, { Component } from "react";
import { animateScroll as scroll } from "react-scroll";

let interval;

const withScroll = ComponentToWrap => {
  class ScrollManagement extends Component {
    listenSearchScroll = (headerHeight, currentWidth) => {
      try {
        var contentPart = document.getElementById("content-container");
        var contentMain = document.getElementById("search-button");
        var searchBox = document.getElementById("search-input");
        var shadowedBackground = document.getElementById("shadowed-background");

        contentPart.addEventListener("scroll", e =>
          this.searchInputScroll(
            contentPart,
            contentMain,
            searchBox,
            shadowedBackground,
            headerHeight,
            currentWidth
          )
        );
        window.addEventListener("resize", e =>
          this.searchInputScroll(
            contentPart,
            contentMain,
            searchBox,
            shadowedBackground,
            headerHeight,
            currentWidth
          )
        );
      } catch (e) {
        return null;
      }
    };

    searchInputScroll = (
      contentPart,
      contentMain,
      searchBox,
      shadowedBackground,
      headerHeight,
      currentWidth
    ) => {
      const offsetTop = 16;
      var contentShape = contentMain.getBoundingClientRect();
      var contentTop = contentShape.top;
      let newTopValue = Math.min(
        Math.max(contentTop - headerHeight + 16, 16),
        window.innerHeight * 0.4
      );

      searchBox.style.top = newTopValue + "px";
      shadowedBackground.style.opacity =
        Math.min(
          1,
          contentPart.scrollTop / (window.innerHeight - headerHeight)
        ) * 0.6;

      if (newTopValue <= offsetTop)
        this.handleMenuButtonMobileDisplay(true, currentWidth);
      else if (newTopValue >= offsetTop + 8)
        this.handleMenuButtonMobileDisplay(false, currentWidth);
    };

    // @todo nothing to do here
    handleMenuButtonMobileDisplay = (isInSearch, currentWidth) => {
      var searchField = document.getElementById("search-container");
      var headerButton = document.getElementById("header-button");
  
      if (!searchField || !headerButton) return;
  
      if (
        currentWidth === "xs" &&
        isInSearch &&
        headerButton.dataset.position === "INITIAL"
      ) {
        searchField.style.paddingLeft = 48 + "px";
        headerButton.style.top = 20 + "px";
        headerButton.style.height = 40 + "px";
        headerButton.style.width = 40 + "px";
        headerButton.style.minWidth = 0 + "px";
        headerButton.style.left = 20 + "px";
        headerButton.dataset.position = "INSIDE";
      } else if (!isInSearch && headerButton.dataset.position !== "INITIAL") {
        searchField.style.paddingLeft = 0 + "px";
        headerButton.style.top = 16 + "px";
        headerButton.style.height = 48 + "px";
        headerButton.style.width = 48 + "px";
        headerButton.style.left = 16 + "px";
        headerButton.dataset.position = "INITIAL";
      }
    };

    easeToSearchResults = (offset, transitionDuration) => {
      var contentPart = document.getElementById("content-container");
      if (!contentPart) return;
      var scrollMax = Math.min(
        contentPart.scrollHeight,
        window.innerHeight - 120
      );
      scroll.scrollTo(scrollMax, {
        duration: transitionDuration,
        smooth: "easeInOutCubic",
        containerId: "content-container",
        offset: offset || 0,
        delay: 200 // @todo : wait that search results is updated before launch scroll / remove this static delay
      });
    };

    scrollTo = (scrollDirection, scrollContainerId) => {
      interval = window.setInterval(function() {
        var element = window.document.getElementById(scrollContainerId);
        switch (scrollDirection) {
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
    };

    resetScroll = scrollContainerId => {
      var element = window.document.getElementById(scrollContainerId);
      if (element) element.scrollLeft = 0;
    };

    scrollStop = () => {
      clearInterval(interval);
    };

    render() {
      return (
        <ComponentToWrap
          {...this.props}
          scrollTo={this.scrollTo}
          scrollStop={this.scrollStop}
          resetScroll={this.resetScroll}
          searchPage={{
            easeToSearchResults: this.easeToSearchResults,
            listenSearchScroll: this.listenSearchScroll
          }}
        />
      );
    }
  }

  return ScrollManagement;
};
export default withScroll;
