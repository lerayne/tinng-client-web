/**
 * Created by lerayne on 02.10.2017.
 */

import {tinngServerURL} from 'config'

export async function verifyUserAuth(token) {
    try {

        const response = await fetch(tinngServerURL + '/checkAuth', {
            method: 'post',
            mode: 'cors',
            headers: {
                // json type forces "OPTIONS" request first. todo - think what to do with it
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({token})
        })

        const data = await response.text()

        if (response.ok) {
            return JSON.parse(data)
        } else {
            throw new Error(data)
        }

    } catch (err) {
        throw err
    }
}