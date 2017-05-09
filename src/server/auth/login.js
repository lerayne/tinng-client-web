/**
 * Created by lerayne on 22.03.17.
 */

import bcrypt from 'bcryptjs'
import url from 'url'

import checkUserAuth from './checkUserAuth'
import grantAccess from './grantAccess'
import getUserAuth from '../api/getUserAuth'

function redirectToFailure(req, res) {
    res.redirect(302, url.format({
        pathname: '/login', query: {
            next: req.body.nextUrl,
            error: 1
        }
    }))
}

export default async function login(req, res) {

    const {payload: currentUser} = await checkUserAuth(req)

    if (currentUser) {
        // Already logged in: redirect back
        res.redirect(302, req.body.nextUrl || '/')
    } else {

        const user = await getUserAuth(req.body.email)

        if (!user) {
            // No such user
            redirectToFailure(req, res)
        } else {
            const passwordCorrect = await bcrypt.compare(req.body.password, user.password_hash)

            if (!passwordCorrect) {
                // Wrong password
                redirectToFailure(req, res)
            } else {
                // User is successfully authed!
                await grantAccess(req, res, user)
                res.redirect(302, req.body.nextUrl || '/')
            }
        }
    }
}
