import React, { useState, useEffect } from 'react'
import {
    PokeDexShell,
    BlueScreen,
    DarkScreen,
    MovePad,
    ConfirmButton,
    HintButton
} from './shell'
import PokemonModel from '../../models/PokemonModel'

export default function PokeDex() {

    const [pokemon, setPokemon] = useState({})
    const [choices, setChoices] = useState([])
    const [hints, setHints] = useState([])
    const [blueScreenData, setBlueScreenData] = useState([])
    const [darkScreenData, setDarkScreenData] = useState([])
    const [mistakes, setMistakes] = useState(0)
    const [startAgain, setStartAgain] = useState(false)

    useEffect(() => { loadData() }, [])
    useEffect(() => {
        setBlueScreenData([
            pokemonImage(pokemon.image, 'contrast(0) brightness(0.5)', null),
            setPokemon])
    }, [pokemon])

    useEffect(() => { setDarkScreenData([choices, setChoices]) }, [choices])
    
    const pokemonImage = (image, filter, text) => {
        return (
            <>
                <img
                    src={image}
                    alt='pokemon'
                    style={{ filter }}
                />
                {text && <p style={{ position: 'absolute', marginTop: 53, width: 200 }}>{text}</p>}
            </>
        )
    }

    const loadData = async () => {
        const model = new PokemonModel()
        const { id, name, type, ability, hintsList, image, choicesList } = await model.GetPokemonData()

        setPokemon({ id, name, type, ability, image, found: false })

        setChoices([
            { text: "WHO'S THAT POKEMON?" },
            ...choicesList.map((choice, index) => {
                return {
                    id: choice.id,
                    selected: index === 0 ? true : false,
                    text: `${index + 1} - ${choice.name.toUpperCase()}`
                };
            })])

        setHints(hintsList.map(hint => {
            return [{ text: hint }, { selected: true, text: 'BACK?' }];
        }))

        setMistakes(0)
        setStartAgain(false)
    }

    const handlePadClick = (direction, data, callback) => {
        let newData = JSON.parse(JSON.stringify(data))
        let selectedIndex = newData.findIndex(f => f.selected)
        if (selectedIndex === undefined) return;

        if (direction === 'up')
            selectedIndex = selectedIndex === 0 ? selectedIndex : selectedIndex - 1
        else
            selectedIndex = selectedIndex === newData.length - 1 ? selectedIndex : selectedIndex + 1

        if (newData[selectedIndex].selected === undefined)
            return;

        newData = newData.map((p, index) => {
            if (p.selected !== undefined) {
                p.selected = (index === selectedIndex) ? true : false
            }

            return p
        })
        callback(newData)
        setDarkScreenData([newData, callback])
    }

    const handleConfirm = () => {
        if (darkScreenData[0] === choices) {
            const choiceId = choices.find(f => f.selected).id
            if (choiceId === pokemon.id) {
                setBlueScreenData([
                    pokemonImage(pokemon.image, 'none', pokemon.name),
                    setPokemon
                ])

                const congrats = mistakes < 3 ?
                    'Maybe you are a good Pokemon trainer after all.' :
                    "You were great, but you still have a long way to go. Catch'em all"

                setDarkScreenData([[
                    { text: 'CONGRATULATIONS!' },
                    { text: '\n' },
                    { text: congrats },
                    { text: 'ANOTHER ONE?', selected: true },
                ]])
                setStartAgain(true)
            }
            else {
                setMistakes(mistakes + 1)
                setBlueScreenData([
                    pokemonImage(pokemon.image, 'contrast(0) brightness(0.5)', 'YOU MISSED! NEED A HINT?'),
                    setPokemon
                ])
            }
        }
        else {
            if (!startAgain)
                setDarkScreenData([choices, setChoices])
            else
                loadData()
        }
    }

    const selectCorrectHint = (hintsList) => {
        let used = hintsList.find(f => f.used)
        if (used) {
            const unused = hintsList.find(f => !f.used)
            if (unused) {
                unused.used = true
                setHints(hintsList)
                return unused
            }
            else {
                hintsList = hintsList.map(m => { m.used = false; return m })
                setHints(hintsList)
                return hintsList[0]
            }
        }

        hintsList[0].used = true
        setHints(hintsList)
        return hintsList[0]
    }

    return (
        <PokeDexShell>
            <BlueScreen render={blueScreenData[0]} />
            <DarkScreen render={darkScreenData[0]} />
            <MovePad
                up={() => handlePadClick('up', darkScreenData[0], darkScreenData[1])}
                down={() => handlePadClick('down', darkScreenData[0], darkScreenData[1])}
            />
            <HintButton getHint={() => {
                if (startAgain) return
                const hint = selectCorrectHint(hints)
                setDarkScreenData([hint, setHints])
            }
            } />
            <ConfirmButton confirm={() => handleConfirm()} />
        </PokeDexShell>
    )
}