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
      }
    }
  }

  componentDidMount() {
    if (this.props.recordStore.values.record.personAvailability) this.setState({ current: this.props.recordStore.values.record.personAvailability });
    else this.setState({ current: this.state.labels.middle });
    observe(this.props.recordStore.values, 'record', (change) => {
      this.setState({ current: change.newValue.personAvailability || 'unspecified' });
    });
  }

  handleAvailabilityClick(newCurrent) {
    this.setState({ current: newCurrent });
    this.props.recordStore.values.record.personAvailability = newCurrent;
    this.props.recordStore.updateRecord();
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
