const Pdex = require('pokeapi-js-wrapper');
const options = {
    protocol: 'https',
    versionPath: '/api/v2/',
    cache: true,
}
export const Pokedex = new Pdex.Pokedex(options);
