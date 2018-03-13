import React from 'react';
import PokemonDetailBox from './PokemonDetailBox';
import { Pokedex } from './utils/Pokedex';

export default class PokemonDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pokemonName: null, pokemonData: ''}
    }

    componentWillMount() {
        let pokemonName = this.props.match.params.name;
        console.log('GET DETAILS FOR POKEMON: ' + pokemonName);
        let self = this;
        Pokedex.getPokemonByName(pokemonName)
        .then(function(response) {
            console.log(response);

            self.setState({
                pokemonName: pokemonName,
                pokemonData: response
            })
        });
    }

    render() {
        const pokemon = this.state.pokemonData;

        // const pokemons = this.state.pokemonList.map((link) =>
        //     <Link 
        //     key={link.url} 
        //     to={`/pokemon/${link.name}`}><li>{link.name}</li></Link>
        // );

        let abilities = <span/>
        let moves = <span/>
        let types = <span/>
        let stats = <span/>
        let pokemonPhotoFront = <span/>
        let pokemonPhotoBack = <span/>
        if (pokemon) {
            abilities = pokemon.abilities.map((item) =>
                <li key={item.ability.url}>{item.ability.name.split('-').join(' ')}</li>
            );

            moves = pokemon.moves.map((item) =>
                <li key={item.move.url}>{item.move.name.split('-').join(' ')}</li>
            );

            types = pokemon.types.map((item) =>
                <li key={item.type.url}>{item.type.name.split('-').join(' ')}</li>
            );
        
            // pokemon.stats.map((item) => {
            //     console.log(item);
            // });

            stats = pokemon.stats.map((item) =>
                <li 
                key={item.stat.url}
                data-base-stat={item.base_stat}
                data-effort={item.effort}
                >{`${item.stat.name.split('-').join(' ')} - ${item.base_stat}%`}</li>
            );

            pokemonPhotoFront = <img src={pokemon.sprites.front_default} alt="" />
            pokemonPhotoBack = <img src={pokemon.sprites.back_default} alt="" />
        }

        return (
            <React.Fragment>
                <h1 className="pokemon-name">{pokemon.name}</h1>

                <div className="pokemon-photos">
                    {pokemonPhotoFront}
                    {pokemonPhotoBack}
                </div>

                <PokemonDetailBox boxName={"Sposobnosti"} boxItems={abilities} />
                <PokemonDetailBox boxName={"Potezi"} boxItems={moves} />
                <PokemonDetailBox boxName={"Vrsta"} boxItems={types} />
                <PokemonDetailBox boxName={"Statistike"} boxItems={stats} />

                {/* <p>Sposobnosti</p>
                {abilities}

                <hr />

                <p>Potezi</p>
                {moves}

                <hr />

                <p>Vrsta</p>
                {types}

                <hr />

                <p>Statistike</p>
                {stats} */}
            </React.Fragment>
        )
    }
}