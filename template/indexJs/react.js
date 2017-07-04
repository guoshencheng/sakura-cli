//TODO: Write some code to replace this

import { Component } from 'react';
import { render } from 'react-dom';
require('./style.scss');

class Custom extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="custom">
        <h1>Sakura-Cli</h1>
        <p>Welcome to Sakura-Cli, Replace me</p>
      </div>
    )
  }
}

render(
  <Custom></Custom>,
  document.querySelector("#appContainer")
)

