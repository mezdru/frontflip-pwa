import React, {Component} from 'react';
import styled, { keyframes } from "styled-components";

const animation = keyframes`
  from {
    opacity 0;
  }
  to {
    opacity 1;
  }
`;

const Modal = styled.div`
  z-index: 100;
  width: 100%;
  height: 3em;
  line-height: 3em;
  position: fixed;
  top: 0;
  background: #f44292;
  color: white;
  cursor: pointer;
  animation: ${animation} 1s linear;
`;

export default class ReloadModal extends Component {

  constructor() {
    super();
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    // Handle global event.
    window.addEventListener("newContentAvailable", () => {
      this.setState({
        show: true
      });
    });
  }
  onClick = () => {
    window.location.reload(window.location.href);
  };

  render() {
    if (!this.state.show) {
      return null;
    }
    // <Modal> is common fixed component.
    return (
      <Modal onClick={this.onClick}>
        <span> New Content Available!please reload </span>
      </Modal>
    );
  }
}