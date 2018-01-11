import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//import math from 'mathjs'

import { runmath } from './demo/calculator2'
//console.log('mmmmmmmmmmmmmm', math, math.eval('1+1'))

const r = runmath('2 UAH + 1 USD ')  //math.eval('1+1')
console.log(r)

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          { String(r) }
        </p>
      </div>
    );
  }
}

export default App;
