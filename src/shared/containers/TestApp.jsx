/**
 * Created by lerayne on 09.05.17.
 */

import React, {Component} from 'react'
import update from 'immutability-helper'
import {Link} from 'react-router'
import css from './TestApp.css'

let connection = false

if (process.env.BROWSER){
    connection = require('../../client/socket').default
}

export default class TestApp extends Component{

    state = {
        inputText:'',
        messages: [],
        user: {
            id: -1,
            name:'anonymous',
            displayName: 'Anonymous',
            role: 'anonymous'
        },
        canPost: false
    }

    componentDidMount(){

        if (connection) {

            connection.userReady.then(user => {
                this.setState({
                    user: user,
                    canPost: user.role !== 'anonymous'
                })
            })

            connection.on('new-message', msg => {
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
        const {inputText, user, canPost} = this.state

        return <div className={css.main}>
            <textarea
                value={inputText}
                onChange={e => this.setState({inputText: e.target.value})}
                onKeyUp={e => {
                    if (e.key === "Enter"){
                        this.send()
                    }
                }}
                disabled={!canPost}
            />

            <button disabled={!canPost} onClick={::this.send}>Send</button>

            <div>
                {this.state.messages.map((message, i) =>
                    <div key={i}>
                        <strong>{user.displayName}:</strong> {message.text}
                    </div>
                )}
            </div>
        </div>
    }

    send(){
        console.log('trying to send message', this.state.inputText)

        if (connection && this.state.canPost){
            connection.emit('chat-message', {
                payload: {
                    text: this.state.inputText
                }
            })
        }
    }
}