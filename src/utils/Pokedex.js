const Pdex = require('pokeapi-js-wrapper');
const options = {
    protocol: 'https',
    versionPath: '/api/v2/',
    cache: true,
    timeout: 5 * 1000 // 5s
}
export const Pokedex = new Pdex.Pokedex(options);
