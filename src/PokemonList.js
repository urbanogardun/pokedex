import React from 'react';
import { Pokedex } from './utils/Pokedex';

export default class PokemonList extends React.Component {
    componentWillMount() {
        var interval = {
        limit: 10,
        offset: 14
        }
        Pokedex.getPokemonsList(interval)
        .then(function(response) {
          console.log(response);
        });
    }

    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}