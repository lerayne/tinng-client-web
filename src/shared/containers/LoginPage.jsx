/**
 * Created by lerayne on 24.06.17.
 */

import React, {Component} from 'react'
//local
import loginRequest from '../../client/loginRequest'

export default class LoginPage extends Component {

    state = {
        loginInput: '',
        passwordInput: ''
    }

    render() {

        const {loginInput, passwordInput} = this.state

        return <div>
            <form action="/login" method="post">
                <div>
                    <input
                        name="login"
                        type="text"
                        value={loginInput}
                        onChange={e => this.setState({loginInput: e.target.value})}
                    />
                </div>
                <div>
                    <input
                        name="password"
                        type="password"
                        value={passwordInput}
                        onChange={e => this.setState({passwordInput: e.target.value})}
                    />
                </div>
                <div>
                    <input type="button" onClick={::this.logIn} value="Log in" />
                </div>
            </form>
        </div>
    }

    // todo: VERY simple auth: login just gets new token, sets in to cookie and reloads to
    // previous/default page
    // only for development!
    async logIn() {

        const {loginInput, passwordInput} = this.state
        const {location} = this.props

        loginRequest(loginInput, passwordInput, location)
    }
}