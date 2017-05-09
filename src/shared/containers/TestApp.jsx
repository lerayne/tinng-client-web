/**
 * Created by lerayne on 09.05.17.
 */

import React, {Component} from 'react'

if (process.env.BROWSER){
    const socket = require('../../client/socket')
}

export default class TestApp extends Component{

    state = {
        inputText:''
    }

    render(){
        const {inputText} = this.state

        return <div>
            <div>

            </div>
            <textarea value={inputText} onChange={e => this.setState({inputText: e.target.value})} />
            <button onClick={::this.send}>Send</button>
        </div>
    }

    send(){
        console.log('SEND', this.state.inputText)
    }
}