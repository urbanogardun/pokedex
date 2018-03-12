import React from 'react';
const localforage = require("localforage");
localforage.config({
    driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver(),
    name: 'Pokedex-app',
    version: 1.0,
    storeName: 'pokedex_app',
    description: 'Pokemoni!'
});

export default class AddPokemonToList extends React.Component {

    addPokemonToList(pokemon) {
        console.log(pokemon);

        localforage.getItem('pokemons')
        .then((value) => {

            if ( (value === null) || (!value.length) ) {
                return localforage.setItem('pokemons', [this.props.name])
            } else {
                if (value.indexOf(this.props.name) === -1) {
                    return localforage.setItem('pokemons', [...value, this.props.name])
                }
            }
    
        }).then(() => {
            return localforage.getItem('pokemons')
        }).then((value) => {
            console.log(value);
        })

    }

    render() {
        return (
            <p onClick={() => { this.addPokemonToList(this.props.name) }}>Add {this.props.name} to my list</p>
        )
    }
}