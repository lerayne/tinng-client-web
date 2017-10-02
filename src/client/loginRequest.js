/**
 * Created by lerayne on 02.10.2017.
 */

import Cookie from 'js-cookie'
import url from 'url'

export default async function loginRequest(loginInput, passwordInput, location) {
    try {
        const {tinngServerURL} = window.config

        const loginResponse = await fetch(tinngServerURL + '/login', {
            method: 'post',
            mode: 'cors',
            body: JSON.stringify({login: loginInput, password: passwordInput}),
            headers: {
                // json type forces "OPTIONS" request first. todo - think what to do with it
                'Content-Type': 'text/plain'
            }
        })

        const data = await loginResponse.text()

        if (loginResponse.ok) {
            const token = data

            console.log('new token', token)

            Cookie.set('access_token', token, {expires: 30})

            const newLocation = url.parse((location.query && location.query.ref) || '/', true)

            // todo: currently no host here
            // todo: probably this bruteforce redirect is wrong
            window.location.href = url.format(newLocation)

        } else {
            window.alert(data)
        }

    } catch (err) {
        console.error('LoginPage logIn error:', err)
    }
}