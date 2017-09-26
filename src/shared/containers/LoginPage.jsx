/**
 * Created by lerayne on 24.06.17.
 */

import React, {Component} from 'react'
import Cookie from 'js-cookie'
import url from 'url'

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
        try {
            const {loginInput, passwordInput} = this.state
            const {location} = this.props

            const loginResponse = await fetch(window.config.tinngServerURL + '/login', {
                method: 'post',
                mode: 'cors',
                body: JSON.stringify({login: loginInput, password: passwordInput}),
                headers: {
                    'Content-Type': 'text/plain'
                }
            })

            const token = await loginResponse.text()

            Cookie.set('access_token', token, {expires: 30,})

            const newLocation = url.parse((location.query && location.query.ref) || '/', true)

            //todo: currently no host here
            window.location.href = url.format(newLocation)
        } catch (err) {
            console.error('LoginPage logIn error:', err)
        }
    }
}