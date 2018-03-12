import React from 'react';
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
        this.state = {pokemonList: [], pageNumber: 1, nextPageOffset: 11}
        // this.trackScrolling = debounce(this.trackScrolling, 2000);
    }
    
    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
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
            <li key={link.url}>{link.name}</li>
        );

        return (
            <div id="pokemon-list">
                <h1>Hello, {this.props.name}</h1>

                {pokemons}
            </div>
        );
    }
}