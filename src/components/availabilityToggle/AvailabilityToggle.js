import React from 'react';
import { inject, observer } from 'mobx-react';
import './Toggle.css';
import { observe } from 'mobx';

let AvailabilityToggle = inject("recordStore")(observer(class AvailabilityToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'unspecified',
      labels: {
        left: 'unavailable',
        middle: 'unspecified',
        right: 'available'
      },
      observer: ()=> {}
    }
  }

  componentDidMount() {
    const { currentUserRecord } = this.props.recordStore;
    if (currentUserRecord && currentUserRecord.personAvailability) 
      this.setState({ current: currentUserRecord.personAvailability });
    else this.setState({ current: this.state.labels.middle });
      this.setState({observer : observe(this.props.recordStore, 'currentUserRecord', (change) => {
        this.setState({ current: (change.newValue && change.newValue.personAvailability) || 'unspecified' });
      })});
  }

  componentWillUnmount() {
    this.state.observer();
  }

  handleAvailabilityClick(newCurrent) {
    this.setState({ current: newCurrent });
    const { currentUserRecord} = this.props.recordStore;
    if(currentUserRecord) {
      this.props.recordStore.updateRecord(currentUserRecord._id, ['personAvailability'], {personAvailability: newCurrent});
    }
  }

  render() {
    let { labels } = this.state;
    let { current } = this.state;

    return (
      <div id="userStatusToggle" className={`menu-status-${current}`}>
        {/* eslint-disable-next-line */}
        <a title={labels.left} className="u" onClick={() => this.handleAvailabilityClick(labels.left)}></a>
        {/* eslint-disable-next-line */}
        <a title={labels.middle} className="n" onClick={() => this.handleAvailabilityClick(labels.middle)}></a>
        {/* eslint-disable-next-line */}
        <a title={labels.right} className="a" onClick={() => this.handleAvailabilityClick(labels.right)}></a>
        <div></div>
      </div>
    );
  }
}));

export default (AvailabilityToggle);
