import React from 'react';
import RemovePokemonFromList from './RemovePokemonFromList';
import { localforage } from './utils/localforageSetup';
import { Link } from 'react-router-dom'

export default class MyPokemonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pokemonList: []}
        this.updateMyListAfterRemovingAPokemon = this.updateMyListAfterRemovingAPokemon.bind(this);
    }

    componentWillMount() {
        localforage.getItem('pokemons')
        .then((result) => {
            result = result === null ? [] : result
            this.setState({
                pokemonList: result
            });
        })
    }

    updateMyListAfterRemovingAPokemon(removedPokemon) {
        let pokemonList = this.state.pokemonList.filter((pokemon) => { return pokemon !== removedPokemon });

        this.setState({
            pokemonList: pokemonList
        });
    }

    render() {
        const pokemons = this.state.pokemonList.map((pokemon) =>
            <React.Fragment key={pokemon}>
                <Link 
                to={`/pokemon/${pokemon}`}><li>{pokemon}</li></Link>

                <RemovePokemonFromList name={pokemon} updateMyListAfterRemovingAPokemon={this.updateMyListAfterRemovingAPokemon} />
            </React.Fragment>
        );

        return (
            <React.Fragment>
                <h1>My Pokemon List Goes Here!</h1>
    
                <hr />
                {pokemons}
            </React.Fragment>
        );
    }
}