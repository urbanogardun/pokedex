import React, { Component } from 'react';
import {  BrowserRouter as Router, Route } from 'react-router-dom'
import PokemonDetails from './PokemonDetails';
import MyPokemonList from './MyPokemonList';
import NavigationAppBar from './NavigationAppBar';
import PokemonList from './PokemonList';

class App extends Component {
  render() {

    return (
      <Router>
        <div className="App">
          <NavigationAppBar />
          <Route exact path="/" component={PokemonList} />
          <Route exact path="/pokemon/:name" component={PokemonDetails} />
          <Route exact path="/list/" component={MyPokemonList} />
        </div>
      </Router>
    );
  }
}

export default App;
