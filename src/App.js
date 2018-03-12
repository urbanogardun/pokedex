import React, { Component } from 'react';
import {  BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';
import PokemonList from './PokemonList';
import PokemonDetails from './PokemonDetails';

class App extends Component {
  render() {

    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={PokemonList}/>
          <Route exact path="/pokemon/:name" component={PokemonDetails}/>
        </div>
      </Router>
    );
  }
}

export default App;
