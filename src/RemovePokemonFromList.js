import React from 'react';
import { localforage } from './utils/localforageSetup';

export default class RemovePokemonFromList extends React.Component {

    removePokemonFromList(pokemon) {

        localforage.getItem('pokemons')
        .then((value) => {

            value = value.filter((val) => { return val !== pokemon })

            if ( (value !== null) || (value.length) ) {
                return localforage.setItem('pokemons', [...value])
            }
    
        }).then(() => {
            this.props.updateMyListAfterRemovingAPokemon(this.props.name);
            return localforage.getItem('pokemons')
        }).then((value) => {
            console.log(value);
        })

    }

    render() {
        return (
            <p onClick={() => { this.removePokemonFromList(this.props.name) }}>Remove {this.props.name} from my list</p>
        )
    }
}