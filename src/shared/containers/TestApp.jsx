/**
 * Created by lerayne on 09.05.17.
 */

import React, {Component} from 'react'
import update from 'immutability-helper'

let socket = false

if (process.env.BROWSER){
    socket = require('../../client/socket').default
}

export default class TestApp extends Component{

    state = {
        inputText:'',
        messages: []
    }

    componentDidMount(){
        if (socket){
            socket.on('new-message', msg => {
                console.log('msg received', msg)
                this.setState(update(this.state, {
                    messages: {$push: [msg.payload]}
                }))
            })
        }
    }

    componentDidUpdate(){
        console.log('new state', {...this.state})
    }

    render(){
        const {inputText} = this.state

        return <div>
            <div>

            </div>
            <textarea
                value={inputText}
                onChange={e => this.setState({inputText: e.target.value})}
                onKeyUp={e => {
                    if (e.key === "Enter"){
                        this.send()
                    }
                }}
            />
            <button onClick={::this.send}>Send</button>
            <div>
                {this.state.messages.map(message =>
                    <div>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    }

    send(){
        console.log('msg sent', this.state.inputText)
        if (socket){
            socket.emit('chat-message', {
                payload: {
                    text: this.state.inputText
                }
            })
        }
    }
}