/**
 * Created by lerayne on 23.03.17.
 */

import ms from 'ms'

import {domain} from 'config'
import {keyExpiresIn} from 'config'
import createToken from './createToken'

export default async function grantAccess(req, res, insecureUser) {

    try {
        // removing password hash
        const {password_hash, ...rest} = insecureUser

        const user = {
            ...rest,
            ip: '0.0.0.0' // todo - current IP
        }

        // todo - get domain from env (doesnt work now on prod)
        // const host = req.get('host')
        // const hostname = host.split(':')[0]

        const token = await createToken(user)

        res.cookie('access_token', token, {
            path: '/',
            domain,
            maxAge: ms(keyExpiresIn)
        })
    } catch (error) {
        console.error('grantAccess:', error)
    }
}