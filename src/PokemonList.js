import React from 'react';
import AddPokemonToList from './AddPokemonToList';
import RemovePokemonFromList from './RemovePokemonFromList';
import { Link } from 'react-router-dom'
import { Pokedex } from './utils/Pokedex';


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
    let nextPageOffset = nextPageUrl.split('=');
    nextPageOffset = nextPageOffset[nextPageOffset.length - 1];
    return nextPageOffset;
}

export default class PokemonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pokemonList: [], pageNumber: 1, nextPageOffset: 10}
        // this.trackScrolling = debounce(this.trackScrolling, 2000);
    }
    
    isBottom(el) {
        if (el) {
            return el.getBoundingClientRect().bottom <= window.innerHeight;
        } else {
            return null;
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
            limit: 10,
            offset: this.state.nextPageOffset
        }

        let self = this;
        Pokedex.getPokemonsList(interval)
        .then(function (response) {
            let nextPageOffset = getNextPageOffset(response.next);

            // Append more pokemons
            self.setState({
                pokemonList: [...self.state.pokemonList, ...response.results],
                nextPageOffset: nextPageOffset
            })
        });
        document.addEventListener('scroll', this.trackScrolling);
    }

    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
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
            <React.Fragment key={link.url}>
                <Link 
                to={`/pokemon/${link.name}`}><li>{link.name}</li></Link>

                <AddPokemonToList name={link.name} />
                <RemovePokemonFromList name={link.name} />
            </React.Fragment>
        );

        return (
            <div id="pokemon-list">
                <h1>Hello, {this.props.name}</h1>
                <h3><Link to={'/list/'}>My List</Link></h3>

                {pokemons}
            </div>
        );
    }
}