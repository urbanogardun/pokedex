import React from 'react';
import { localforage } from './utils/localforageSetup';
import { goToPokemon } from './utils/helpers';
import MyPokemonCheckbox from './MyPokemonCheckbox';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class MyPokemonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pokemonList: [], checked: []}
        this.updateMyListAfterRemovingAPokemon = this.updateMyListAfterRemovingAPokemon.bind(this);
    }

    componentWillMount() {
        localforage.getItem('pokemons')
        .then((result) => {
            result = result === null ? [] : result;
            let namesOfPokemonsInMyList = result === null ? [] : result.map((val) => { return val.name })
            this.setState({
                pokemonList: result,
                checked: namesOfPokemonsInMyList
            });
        })
    }

    updateMyListAfterRemovingAPokemon(removedPokemon) {
        let pokemonList = this.state.pokemonList.filter((pokemon) => { return pokemon.name !== removedPokemon });

        this.setState({
            pokemonList: pokemonList
        });
    }

    render() {
        const { classes } = this.props;
        const pokemons = this.state.pokemonList.reverse().map((link) => {
            return (
                <ListItem onClick={() => { goToPokemon(this.props, `/pokemon/${link.name}`) }} key={`/pokemon/${link.name}`} dense button className={`${classes.listItem} pokemon-list-item`}>
                    <Avatar className="pokemon-avatar" alt={link.name} src={link.photo} />
                    <ListItemText className="pokemon-list-name" primary={`${link.name}`} />
                        <ListItemSecondaryAction>
                            <MyPokemonCheckbox 
                            name={link.name} 
                            pokemonPhoto={link.photo}
                            checked={this.state.checked} 
                            updateMyListAfterRemovingAPokemon={this.updateMyListAfterRemovingAPokemon}
                            />
                        </ListItemSecondaryAction>
                </ListItem>
            );
        })

        let myListStats;
        if (this.state.pokemonList.length) {
            myListStats = <p className="my-list-total-pokemons">Dodano Pokemona: {this.state.pokemonList.length}</p>
        }
        return (

            <div className={`${classes.root}`} id="my-pokemon-list">
                <h1 className="my-list">Moji Pokemoni</h1>
                {myListStats}
                <List>
                    {pokemons}
                </List>
            </div>
        );
    }
}

export default withStyles(styles)(MyPokemonList);