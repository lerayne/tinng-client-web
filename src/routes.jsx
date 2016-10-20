/**
 * Created by lerayne on 20.09.16.
 */

import React from 'react';
import {Route, IndexRoute} from 'react-router';

import IndexPage from './containers/IndexPage';
import Conversation from './containers/Conversation';

const routes = (
    <Route path="/" component={IndexPage}>
        <IndexRoute component={Conversation} />
    </Route>
)

export default routes