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

export default async function createIsomorphicPage(req, res) {

    // creating local (per connection) store
    const store = configureStore()

    const {payload: currentUser} = await checkUserAuth(req)

    if (currentUser) {
        store.dispatch({
            type: 'SET_USER',
            payload: currentUser
        })

        // todo - only reauthorize near expiration (performance)
        // todo - check ip

        // sliding - now only on static page render
        await grantAccess(req, res, currentUser)
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
            const promises = renderProps.routes.reduce((arr, route) => {
                const comp = route.component.WrappedComponent || route.component
                if (comp.initialize) {
                    return arr.concat([comp.initialize(store.dispatch, renderProps.location)])
                } else return arr
            }, [])

            // when all promises are resolved - store is already filled with their results
            if (promises.length) {
                await Promise.all(promises)
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