import { Component } from 'react';
import { render } from 'react-dom';

class Custom extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="custom"></div>
    )
  }
}

render(
  <Custom></Custom>,
  document.querySelector("#appContainer")
)
