/**
 * Created by lerayne on 23.03.17.
 */

import jwt from 'jsonwebtoken'
import {secretKey, keyExpiresIn} from 'config'

export default function createToken(payload, optionsOverride = {}){
    const options = {
        expiresIn: keyExpiresIn,
        ...optionsOverride
    }

    return new Promise((resolve, reject) => {
        jwt.sign({payload}, secretKey, options, function (err, token) {
            if (err) {
                reject(err)
            } else {
                resolve(token)
            }
        })
    })
}