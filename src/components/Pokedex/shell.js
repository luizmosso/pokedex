import React from 'react'
import './shell.css'

export function BlueScreen(props) {
    return (
        <div className='BlueScreen'>{props.render && props.render}</div>
    )
}

export function DarkScreen(props) {
    const selectedStyle = { color: '#3A333D', backgroundColor: '#efff6abf' }
    return (
        <div className='DarkScreen'>
            {
                props.render &&
                props.render.map((item, index) => {
                    return <p key={index} style={item.selected ? selectedStyle : {}}>{item.text}</p>
                })}
        </div>
    )
}

export function MovePad(props) {
    return (
        <div className='MovePad'>
            <div className='pad horizontal'>
                <div onClick={props.left} className='arrow'>▲</div>
                <div className='circle'></div>
                <div onClick={props.right} className='arrow'>▼</div>
            </div>
            <div className='pad vertical'>
                <div onClick={props.up} className='arrow'>▲</div>
                <div className='circle'></div>
                <div onClick={props.down} className='arrow'>▼</div>
            </div>
        </div>
    )
}

export function ConfirmButton(props) {
    return (
        <div onClick={props.confirm} className='ConfirmButton'>OK</div>
    )
}

export function HintButton(props) {
    return (
        <div onClick={props.getHint} className='HintButton'>HINT?</div>
    )
}


export function PokeDexShell(props) {

    const renderChild = (children, type) => {
        if (children.length > 1)
            return children.find(f => f.type.name === type)
        else
            return children.type.name === type ? children : null
    }

    return (
        <div id='pokedex'>
            <div id='parte1'>
                <div id='border'></div>
                <div id='header'>
                    <div className='square'>
                        <div className='bigCircle'>
                            <div className='smallCircle'>
                            </div>
                        </div>
                    </div>
                    <div className='shapeGroup'>
                        <div className='retangle'>
                            <div className='light r'></div>
                            <div className='light y'></div>
                            <div className='light g'></div>
                        </div>
                        <div className='triangle'></div>
                    </div>
                </div>
                <div id='body'>
                    <div id='screen'>
                        <div className='side'>
                            <div className='sideRet'></div>
                            <div className='sideTri'>
                            </div>
                        </div>
                        <div className='main'>
                            <div className='tinyButtons'>
                                <div className='tinyButton'></div>
                                <div className='tinyButton'></div>
                            </div>
                            {renderChild(props.children, 'BlueScreen')}
                            <div className='button'></div>
                            <div className='audio'>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div id='buttons'>
                        <div className='leftSide'>
                            {renderChild(props.children, 'ConfirmButton')}
                            <div className='drop'></div>
                            <div className='drop drop2'></div>
                            {renderChild(props.children, 'HintButton')}
                        </div>
                        {renderChild(props.children, 'MovePad')}
                    </div>
                </div>
            </div>
            <div id='meio'>
                <div className='bottom'></div>
            </div>
            <div id='parte2'>
                <div id='header'>
                    <div className='square'></div>
                    <div className='triangle'></div>
                    <div className='main'>
                        {renderChild(props.children, 'DarkScreen')}
                    </div>
                </div>
            </div>
        </div>
    )
}