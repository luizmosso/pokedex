import React from 'react';
import './index.css';
import PokeDex from '../../components/Pokedex'

function DexScreen() {
    return (
        <div className="DexScreen">
            <PokeDex pokemon={'pikachu'} />
        </div>
    );
}

export default DexScreen;
