/**
 * Created by lerayne on 22.03.17.
 */

import jwt from 'jsonwebtoken'
import {secretKey} from 'config'

export default function checkUserAuth(accessToken){
    return new Promise((resolve, reject) => {

        if (accessToken === undefined || !accessToken) {
            resolve(false)
        } else {
            jwt.verify(accessToken, secretKey, (err, decodedUserInfo) => {
                if (err) {
                    resolve(false)
                } else {
                    resolve(decodedUserInfo)
                }
            })
        }
    })
}
