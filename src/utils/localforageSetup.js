const localFA = require("localforage");
localFA.config({
    driver: localFA.WEBSQL, // Force WebSQL; same as using setDriver(),
    name: 'Pokedex-app',
    version: 1.0,
    storeName: 'pokedex_app',
    description: 'Pokemoni!'
});
export const localforage = localFA;