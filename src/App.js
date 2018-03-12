import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Pokedex } from './utils/Pokedex';

class App extends Component {
  render() {

    var interval = {
      limit: 30,
      offset: 14
    }
    Pokedex.getPokemonsList(interval)
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
