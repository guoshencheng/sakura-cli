//TODO: Write some code to replace this

import { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
require('./style.scss');

class Custom extends Component {
  constructor(props) {
    super(props);
  }
    
  componentDidMount() {
    console.log(123)
    axios.post('/proxy/1/api/login.json').then(response => {
      console.log(response.data);
    }).catch(reason => {
      console.log(reason);
    })
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

