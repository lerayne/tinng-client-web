/**
 * Created by lerayne on 09.05.17.
 */

import React from 'react'
import ReactDom from 'react-dom/server'
import {match, RouterContext} from 'react-router'
import {Provider} from 'react-redux'

//todo: make these right
import getRoutingScheme from '../shared/routes'
import getHTML from './getHTML'
import configureStore from '../shared/configureStore'
import {verifyUserAuth} from './requests/auth'

/**
 * On http request does all necessary data manipulations and sends back HTML page. This includes:
 * redux store configuration, authentication check, API server calls
 */
export default async function createStaticPage(req, res) {

    // creating local (per connection) store
    const store = configureStore()

    let currentUser = false

    //temporary auth
    try {
        currentUser = await verifyUserAuth(req.cookies && req.cookies.access_token)
        console.log('currentUser', currentUser)
    } catch (err) {
        console.error('createStaticPage auth error:', err)
    }

    // this assumes jwt-token contains all necessary user data for redux
    if (currentUser) {
        store.dispatch({
            type: 'SET_USER',
            payload: currentUser
        })

        // todo: was reauth each page load. Now reauth turned off. Reauthorize only needed near
        // expiration
    }

    // checks location URL against routing scheme and renders what's found (even if 404 found)
    match({
            routes: getRoutingScheme(store),
            location: req.url
        },
        async (error, redirectLocation, renderProps) => {

            // regular error responses
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
            // to make this possible the container component has to have "initilaize" _static_
            // method which takes dispatch and location and returns a promise
            const promises = []

            renderProps.routes.forEach(route => {
                const component = route.component.WrappedComponent || route.component

                if (component.initialize) {
                    promises.push([component.initialize(store.dispatch, renderProps.location)])
                }
            })

            // Since reducer change is syncronous, when all promises are resolved - store is
            // already filled with their results. Parsing promise response not needed
            if (promises.length) {
                try {
                    await Promise.all(promises)
                } catch (err) {
                    console.error('createStaticPage initialize error:', err)
                    return res.status(500).send('error rendering static page: one of async initializers failed')
                }
            }

            // actually renders store to HTML string
            const componentHTML = ReactDom.renderToString(
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            )

            const currentState = store.getState()

            // get HTML string
            res.send(getHTML(componentHTML, currentState))
        }
    )
}