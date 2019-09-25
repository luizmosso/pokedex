export default class PokemonModel {

    constructor() {
        this.BASEURL = 'https://pokeapi.co/api/v2/pokemon'
        this.MINID = 1
        this.MAXID = 807
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    shufflePokemonList = (list) => {
        for (let i = list.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        return list
    }

    async GetPokemon(id) {
        try {
            const response = await fetch(`${this.BASEURL}/${id}`, { method: 'GET' })
            const pokemon = await response.json()
            return pokemon
        } catch (error) {
            console.log(error)
        }
    }

    async GetPokemonList(secretPokemon) {
        try {
            let listOfPokemon = []
            while (listOfPokemon.length < 5) {
                const pokemonID = this.getRandomInt(this.MINID, this.MAXID)
                if (pokemonID === secretPokemon.id) continue

                const pokemon = await this.GetPokemon(pokemonID)
                listOfPokemon.push({ id: pokemon.id, name: pokemon.name })
            }

            listOfPokemon = [...listOfPokemon, { id: secretPokemon.id, name: secretPokemon.name }]
            listOfPokemon = this.shufflePokemonList(listOfPokemon)

            return listOfPokemon
        } catch (error) {
            console.log(error)
        }
    }

    async GetPokemonData() {
        try {
            const pokemonID = this.getRandomInt(this.MINID, this.MAXID)
            const secretPokemon = await this.GetPokemon(pokemonID)
            const choicesList = await this.GetPokemonList(secretPokemon)

            const id = secretPokemon.id
            const name = secretPokemon.name
            const type = secretPokemon.types[0].type.name
            const ability = secretPokemon.abilities[0].ability.name
            const hintsList = [
                `Este Pokemon é do tipo "${type}"`,
                `Em batalha, uma das principais habilidades deste pokemon é  o "${ability}"`
            ]
            const image = secretPokemon.sprites.front_default
            return { id, name, type, ability, hintsList, image, choicesList }

        } catch (error) {
            console.log(error)
        }
    }
}

