import React from 'react'
import mojs from 'mo-js'

let interval;

class ClickBurst extends React.Component {
  state = {
    numBurstsToGenerate: 10,
    bursts: [],
  }

  rand = ({ min = 0, max = 1, int = true }) => {
    if (int) {
      return Math.floor(Math.random() * (max - min) + min)
    } else {
      return Math.random() * (max - min) + min
    }
  }

  generateBursts = (numBursts = this.state.numBurstsToGenerate) => {
    this.setState({
      bursts: [],
    })

    while (this.state.bursts.length < this.state.numBurstsToGenerate) {
      this.state.bursts.push(
        new mojs.Burst({
          left: 0,
          top: 0,
          radius: 30,
          angle: this.rand({ min: 0, max: 359 }),
          children: {
            shape: `line`,
            radius: this.rand({ min: 2, max: 12 }),
            scale: this.rand({ min: .8, max: 1.5, int: false }),
            stroke: `rgb(255,0,24)`,
            strokeDasharray: `100%`,
            strokeDashoffset: { '-100%': `100%` },
            duration: this.rand({ min: 400, max: 600 }),
            easing: `quad.out`,
          },
          onStart() {
            this.el.style.zIndex = `99999`
          },
          onComplete() {
            this.el.style.zIndex = `-666`
          },
        }),
      )
    }
  }

  kaboom = (e, child) => {
    e.stopPropagation()

    if (this.state.bursts.length !== this.state.numBurstsToGenerate) {
      this.generateBursts()
    }

    let el = (e && e.target ? e.target.children[0] : null);

    if (el) {
      var viewportOffset = el.getBoundingClientRect();
      var top = viewportOffset.top + (viewportOffset.height / 2);
      var left = viewportOffset.left + (viewportOffset.width / 2);

      this.state.bursts[this.rand({ max: this.state.bursts.length })]
        .tune({ x: left, y: top })
        .replay()
    }

    if (child.props.onClick) child.props.onClick()
  }

  zoomEffect = (el) => {
    if (!el) return;
    new mojs.Html({
      el: el,
      duration: 500,
      scale: { 2: 1 },
      easing: mojs.easing.out
    }).replay();
  }

  zoomLoop = (e, child) => {
    e.persist();
    var event = e;
    if (event && event.target) {

      var el = event.target.children[0]
      this.zoomEffect(el);
      this.kaboom(event, child);

      event.currentTarget.addEventListener('mouseout', (e2) => {
        this.stopZoomLoop(e, child);
      });

      interval = setInterval(() => {
        this.zoomEffect(el);
        this.kaboom(event, child);
      }, 500);

    }
    if (child.props.onMouseDown) child.props.onMouseDown(e)
  }

  stopZoomLoop = (e, child) => {
    clearInterval(interval);
    setTimeout(this.clearShapes, 500);
    if (child.props.onMouseUp) child.props.onMouseUp(e)
  }

  clearShapes = () => {
    var shapes = document.querySelectorAll("[data-name='mojs-shape']");
    shapes.forEach(shape => {
      shape.parentNode.removeChild(shape);
    });
    this.setState({bursts: []});
  }

  render() {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        onClick: e => this.kaboom(e, child),
        onMouseDown: e => this.zoomLoop(e, child),
        onMouseUp: e => this.stopZoomLoop(e, child),
        style: {
          cursor: `pointer`,
          userSelect: `none`,
        },
      })
    })
  }
}

export default ClickBurst
