import React from 'react';
import { localforage } from './utils/localforageSetup';
import { withStyles } from 'material-ui/styles';
import Switch from 'material-ui/Switch';
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

            if (!this.props.onMainPokemonPage) {
                this.props.updateMyListAfterRemovingAPokemon(this.props.name);
            }

            return localforage.getItem('pokemons')
        }).then((value) => {
            console.log(value);
        })

    }

    addPokemonToList(pokemon, pokemonPhoto) {
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

            if (!this.props.onMainPokemonPage) {
                this.props.updateMyListAfterAddingAPokemon(this.props.name);
            }

            return localforage.getItem('pokemons')
        }).then((value) => {
            console.log(value);
        })

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.onMainPokemonPage) {
            if (nextProps.isPokemonInMyList) {
                this.setState({
                    checked: [nextProps.isPokemonInMyList]
                })
            } else {
                this.setState({
                    checked: []
                })
            }
        }
    }

    handleTogglePokemonDetailsPage(pokemon) {
        this.setState({
            checked: this.state.checked.length > 0 ? [] : [true],
        }, () => {
            if (this.state.checked.length > 0) {
                this.addPokemonToList(pokemon, this.props.pokemonPhoto);
            } else {
                this.removePokemonFromList(pokemon);
            }
        })
    }

    render() {
        if (this.props.onMainPokemonPage) {
            return (
                <Switch
                    onClick={(e) => { e.stopPropagation(); }}
                    checked={this.state.checked.length > 0}
                    onChange={(e) => {this.handleTogglePokemonDetailsPage(this.props.name)}}
                    title={this.state.checked.length > 0 ? "Izbaci Pokemona iz moje liste" : "Dodaj Pokemona u listu"}
                />
            );
        } else {
            return (
                <Checkbox
                    onClick={(e) => { e.stopPropagation(); }}
                    onChange={this.handleToggle(this.props.name)}
                    checked={this.props.checked.indexOf(this.props.name) !== -1}
                    title={this.props.checked.indexOf(this.props.name) !== -1 ? "Izbaci Pokemona iz moje liste" : "Dodaj Pokemona u listu"}
                />
            );
        }

    }
}

export default withStyles(styles)(MyPokemonCheckbox);