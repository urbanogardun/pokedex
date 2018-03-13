import React from 'react';
import { Link } from 'react-router-dom'
import { Pokedex } from './utils/Pokedex';
import { localforage } from './utils/localforageSetup';
import MyPokemonCheckbox from './MyPokemonCheckbox';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { CircularProgress } from 'material-ui/Progress';

function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}

function getNextPageOffset(nextPageUrl) {
    if (nextPageUrl) {
        let nextPageOffset = nextPageUrl.split('=');
        nextPageOffset = nextPageOffset[nextPageOffset.length - 1];
        return nextPageOffset;
    } else {
        return null;
    }
}

function getPokemonPhoto(pokemonUrl) {
    let pokemonPhoto = pokemonUrl.split('/pokemon/').pop();
    pokemonPhoto = pokemonPhoto.substring(0, pokemonPhoto.length - 1) + '.png';
    return pokemonPhoto;
}

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class PokemonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: [], pokemonList: [], pageNumber: 1, nextPageOffset: 50 }
        // this.trackScrolling = debounce(this.trackScrolling, 2000);
        this.updateMyListAfterRemovingAPokemon = this.updateMyListAfterRemovingAPokemon.bind(this);
        this.updateMyListAfterAddingAPokemon = this.updateMyListAfterAddingAPokemon.bind(this);
        this.showAjaxLoaderIfOnBottom = this.showAjaxLoaderIfOnBottom.bind(this);
    }

    isBottom(el) {
        if (el) {
            return el.getBoundingClientRect().bottom <= window.innerHeight;
        } else {
            return null;
        }
    }

    showAjaxLoaderIfOnBottom() {
        const wrappedElement = document.getElementById('pokemon-list');

        if ( (this.state.pokemonList.length) && (document.getElementsByClassName('ajax-loader-pokemon-list')[0]) ) {
            if (this.isBottom(wrappedElement)) {
                console.log('HIDE THE FIRST AJAX LOADER');
                document.getElementsByClassName('ajax-loader-pokemon-list-initial')[0].style.visibility = 'hidden';  
                document.getElementsByClassName('ajax-loader-pokemon-list')[0].style.visibility = 'visible';
            } else {
                document.getElementsByClassName('ajax-loader-pokemon-list')[0].style.visibility = 'hidden';
            }
        }

    }

    trackScrolling = debounce(() => {
        const wrappedElement = document.getElementById('pokemon-list');
        if (this.isBottom(wrappedElement)) {
            console.log('pokemon-list bottom reached');
            this.loadMorePokemons();
        }
    }, 1000);

    loadMorePokemons() {
        let interval = {
            limit: 20,
            offset: this.state.nextPageOffset
        }

        let self = this;
        let pokemonList = [];
        let nextPageOffset;

        // If there are more results left to get from pokeapi
        if (this.state.nextPageOffset !== null) {
            Pokedex.getPokemonsList(interval)
            .then(function (response) {
                pokemonList = response.results;
                nextPageOffset = getNextPageOffset(response.next);
                return localforage.getItem('pokemons')
            })
            .then(function(pokemonsInMyList) {
                pokemonsInMyList = pokemonsInMyList === null ? [] : pokemonsInMyList.map((val) => { return val.name })
                // Append more pokemons
                self.setState({
                    pokemonList: [...self.state.pokemonList, ...pokemonList],
                    nextPageOffset: nextPageOffset,
                    checked: pokemonsInMyList
                });

                // Cleanup if we got all the pokemons
                if (nextPageOffset === null) {
                    document.getElementsByClassName('ajax-loader-pokemon-list')[0].style.display = 'none';
                    document.removeEventListener('scroll', self.trackScrolling);
                    document.removeEventListener('scroll', self.showAjaxLoaderIfOnBottom);
                }

            })
        }

    }

    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
        document.addEventListener('scroll', this.showAjaxLoaderIfOnBottom);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
        document.removeEventListener('scroll', this.showAjaxLoaderIfOnBottom);
    }

    componentWillMount() {
        var interval = {
            limit: 50,
            offset: 0
        }
        var self = this;
        let pokemonList = [];
        Pokedex.getPokemonsList(interval)
        .then(function (response) {

            // Hide ajax loader and display retrieved pokemon data
            document.getElementById('pokemon-list').style.visibility = 'initial';
            document.getElementsByClassName('ajax-loader-pokemon-list-initial')[0].style.visibility = 'hidden';

            pokemonList = response.results;
            return localforage.getItem('pokemons')
        })
        .then(function (pokemonsInMyList) {
            // Append more pokemons
            pokemonsInMyList = pokemonsInMyList === null ? [] : pokemonsInMyList.map((val) => { return val.name })
            self.setState({
                pokemonList: [...self.state.pokemonList, ...pokemonList],
                checked: pokemonsInMyList
            });
        });
    }

    handleToggle = value => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };

    updateMyListAfterRemovingAPokemon(removedPokemon) {
        let checked = this.state.checked.filter((pokemon) => { return pokemon !== removedPokemon });

        this.setState({
            checked: checked
        });
    }

    updateMyListAfterAddingAPokemon(addedPokemon) {
        this.setState({
            checked: [...this.state.checked, addedPokemon]
        });
    }

    render() {
        const { classes } = this.props;
        const pokemons = this.state.pokemonList.map((link) => {
            
            let pokemonPhoto = getPokemonPhoto(link.url);

            return (
                <ListItem key={link.url} dense button className={classes.listItem}>
                    <Avatar alt="Remy Sharp" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonPhoto}`} />
                    <Link className="pokemon-details-link" to={`/pokemon/${link.name}`}><ListItemText primary={`${link.name}`} />
                        <ListItemSecondaryAction>
                            <MyPokemonCheckbox 
                            name={link.name} 
                            pokemonPhoto={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonPhoto}`}
                            checked={this.state.checked} 
                            updateMyListAfterRemovingAPokemon={this.updateMyListAfterRemovingAPokemon}
                            updateMyListAfterAddingAPokemon={this.updateMyListAfterAddingAPokemon} />
                        </ListItemSecondaryAction>
                    </Link>
                </ListItem>
            );
        })

        return (
            <React.Fragment>
                <CircularProgress className="ajax-loader-pokemon-list-initial" size={50} />
                <div className={`${classes.root}`} id="pokemon-list">
                    <List>
                        {pokemons}
                        <CircularProgress className="ajax-loader-pokemon-list" size={50} />
                    </List>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(PokemonList);