import React, { Component } from 'react';
import {  BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';
import PokemonList from './PokemonList';
import PokemonDetails from './PokemonDetails';
import MyPokemonList from './MyPokemonList';

class App extends Component {
  render() {

    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={PokemonList} />
          <Route exact path="/pokemon/:name" component={PokemonDetails} />
          <Route exact path="/list/" component={MyPokemonList} />
        </div>
      </Router>
    );
  }
}

export default App;
