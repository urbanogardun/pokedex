import React from 'react';
import { Pokedex } from './utils/Pokedex';

export default class PokemonDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pokemonName: null, pokemonData: ''}
    }

    componentWillMount() {
        let pokemonName = this.props.match.params.name;
        console.log('GET DETAILS FOR POKEMON: ' + pokemonName);
        let self = this;
        Pokedex.getPokemonByName(pokemonName)
        .then(function(response) {
            console.log(response);

            self.setState({
                pokemonName: pokemonName,
                pokemonData: response
            })
        });
    }

    render() {
        const pokemon = this.state.pokemonData;

        return (
            <React.Fragment>
                <h1>{pokemon.name}</h1>
            </React.Fragment>
        )
    }
}