/**
 * Created by lerayne on 20.09.16.
 */

import React from 'react';
import {Route, IndexRoute} from 'react-router';

import IndexPage from './containers/IndexPage';
import PageConversation from './containers/PageConversation';

const routes = (
    <Route path="/" component={IndexPage}>
        <IndexRoute component={PageConversation} />
    </Route>
)

export default routes