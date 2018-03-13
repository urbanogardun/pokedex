import React from 'react';
import { localforage } from './utils/localforageSetup';
import { withStyles } from 'material-ui/styles';
import Checkbox from 'material-ui/Checkbox';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class MyPokemonCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: [] }
    }

    handleToggle = value => () => {
        const currentIndex = this.props.checked.indexOf(value);
        const newChecked = [...this.props.checked];

        if (currentIndex === -1) {
            newChecked.push(value);
            this.addPokemonToList(this.props.name, this.props.pokemonPhoto);
        } else {
            this.removePokemonFromList(this.props.name);
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };

    removePokemonFromList(pokemon) {

        localforage.getItem('pokemons')
        .then((value) => {

            value = value.filter((val) => { return val.name !== pokemon })

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

    addPokemonToList(pokemon, pokemonPhoto) {
        console.log(pokemon);
        console.log('photo: ' + pokemonPhoto);

        localforage.getItem('pokemons')
        .then((value) => {

            if ( (value === null) || (!value.length) ) {
                return localforage.setItem('pokemons', [{name: pokemon, photo: pokemonPhoto}])
            } else {
                let isPokemonAlreadySaved = value.find(val => val.name === pokemon);
                if (!isPokemonAlreadySaved) {
                    return localforage.setItem('pokemons', [...value, {name: pokemon, photo: pokemonPhoto}])
                }
            }
    
        }).then(() => {
            this.props.updateMyListAfterAddingAPokemon(this.props.name);
            return localforage.getItem('pokemons')
        }).then((value) => {
            console.log(value);
        })

    }

    render() {
        return (
            <Checkbox
                onClick={(e) => { e.stopPropagation(); }}
                onChange={this.handleToggle(this.props.name)}
                checked={this.props.checked.indexOf(this.props.name) !== -1}
                title={this.props.checked.indexOf(this.props.name) !== -1 ? "Izbaci Pokemona sa svoje liste" : "Dodaj Pokemona u listu"}
            />
        );
    }
}

export default withStyles(styles)(MyPokemonCheckbox);