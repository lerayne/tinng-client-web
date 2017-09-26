/**
 * Created by lerayne on 09.05.17.
 */

import React from 'react'
import ReactDom from 'react-dom/server'
import {match, RouterContext} from 'react-router'
import {Provider} from 'react-redux'

//todo: make these right
import routes from '../shared/routes'
import getHTML from './getHTML'
import configureStore from '../shared/configureStore'
import checkUserAuth from './auth/checkUserAuth'
import grantAccess from './auth/grantAccess'

/**
 * On http request does all necessary data manipulations and sends back HTML page. This includes:
 * redux store configuration, authentication
 *
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
export default async function createIsomorphicPage(req, res) {

    // creating local (per connection) store
    const store = configureStore()

    //temporary auth
    try {
        const {payload: currentUser} = await checkUserAuth(req.cookies && req.cookies.access_token)
    } catch (err) {
        console.error('createIsomorphicPage auth error:', err)
    }

    // this assumes jwt-token contains all necessary user data for redux
    if (currentUser) {
        store.dispatch({
            type: 'SET_USER',
            payload: currentUser
        })

        // todo: now reauth each page load. Reauthorize only needed near expiration (performance)
        // todo: check ip
        // sliding cookie-auth prolongation - now only on static page render
        // read about jwt-token prolongation.
        try {
            await grantAccess(req, res, currentUser)
        } catch (err) {
            console.error('createIsomorphicPage grantAccess error:', err)
        }
    }

    // matching routing
    match({
            routes: routes(store),
            location: req.url
        },
        async (error, redirectLocation, renderProps) => {

            if (redirectLocation) { // Redirect
                return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
            }

            if (error) { // Any error occured
                return res.status(500).send(error.message)
            }

            if (!renderProps) { // route doesnt match the URL
                return res.status(404).send('Not found')
            }

            // Collect initial promises for components
            // to make this possible the container component has to have "initilaize" static method
            // which takes dispatch and location and returns a promise
            const promises = renderProps.routes.reduce((arr, route) => {
                const component = route.component.WrappedComponent || route.component
                if (component.initialize) {
                    return arr.concat([component.initialize(store.dispatch, renderProps.location)])
                } else return arr
            }, [])

            // When all promises are resolved - store is already filled with their results.
            // Parsing promise response not needed
            if (promises.length) {
                try {
                    await Promise.all(promises)
                } catch (err) {
                    console.error('createIsomorphicPage initialize error:', err)
                }
            }

            const componentHTML = ReactDom.renderToString(
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            )

            // get HTML string
            res.send(getHTML(componentHTML, store.getState()))
        }
    )
}