import React from 'react';
import { Pokedex } from './utils/Pokedex';

export default class PokemonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pokemonList: []}
    }

    componentWillMount() {
        var interval = {
            limit: 10,
            offset: 0
        }
        var self = this;
        Pokedex.getPokemonsList(interval)
        .then(function (response) {
            // Append more pokemons
            self.setState({
                pokemonList: [...self.state.pokemonList, ...response.results]
            })
        });
    }

    render() {
        const pokemons = this.state.pokemonList.map((link) =>
            <li key={link.url}>{link.name}</li>
        );

        return (
            <div>
                <h1>Hello, {this.props.name}</h1>

                {pokemons}
            </div>
        );
    }
}