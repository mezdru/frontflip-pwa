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
  z-index: 99999;
  box-sizing: border-box;
  width: calc(100% - 32px);
  position: fixed;
  bottom: 0;
  margin: 16px;
  padding: 16px;
  background: rgb(50,50,50);
  color: rgb(200,200,200);
  cursor: pointer;
  animation: ${animation} 1s linear;
  text-align:center;
  & a {
    color: white;
    font-weight: 600;
  }
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
        <span> New Content Available. Restart to update.</span>
      </Modal>
    );
  }
}