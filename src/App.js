import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const Pokedex = require('pokeapi-js-wrapper');
const options = {
  protocol: 'https',
  versionPath: '/api/v2/',
  cache: true,
  timeout: 5 * 1000 // 5s
}
const P = new Pokedex.Pokedex(options);

class App extends Component {
  render() {

    var interval = {
      limit: 10,
      offset: 34
    }
    P.getPokemonsList(interval)
    .then(function(response) {
      console.log(response);
    });

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
