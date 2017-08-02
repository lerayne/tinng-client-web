/**
 * Created by lerayne on 24.06.17.
 */

import React, {Component} from 'react'

export default class LoginPage extends Component {

    state = {
        loginInput:'',
        passwordInput:''
    }

    render(){

        const {loginInput, passwordInput} = this.state

        return <div>
            <div>
                <input
                    type="text"
                    value={loginInput}
                    onChange={e => this.setState({loginInput: e.target.value})}
                />
            </div>
            <div>
                <input
                    type="password"
                    value={passwordInput}
                    onChange={e => this.setState({passwordInput: e.target.value})}
                />
            </div>
            <div>
                <button onClick={::this.login}>Log in</button>
            </div>
        </div>
    }

    login(){
        console.log({...this.state})
    }
}