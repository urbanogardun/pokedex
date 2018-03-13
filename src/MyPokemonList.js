import React from 'react';
import { localforage } from './utils/localforageSetup';
import { Link } from 'react-router-dom';
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
            console.log(result);
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
        const pokemons = this.state.pokemonList.map((link) => {
            console.log(link.name);
            return (
                <ListItem key={`/pokemon/${link.name}`} dense button className={classes.listItem}>
                    <Avatar alt={link.name} src={link.photo} />
                    <Link className="pokemon-details-link" to={`/pokemon/${link.name}`}><ListItemText primary={`${link.name}`} />
                        <ListItemSecondaryAction>
                            <MyPokemonCheckbox 
                            name={link.name} 
                            pokemonPhoto={link.photo}
                            checked={this.state.checked} 
                            updateMyListAfterRemovingAPokemon={this.updateMyListAfterRemovingAPokemon}
                            />
                        </ListItemSecondaryAction>
                    </Link>
                </ListItem>
            );
        })

        return (
            <div className={`${classes.root}`} id="my-pokemon-list">
                <h1 className="my-list">Moji Pokemoni</h1>
                <List>
                    {pokemons}
                </List>
            </div>
        );
    }
}

export default withStyles(styles)(MyPokemonList);