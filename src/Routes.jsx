/**
 * Created by lerayne on 20.09.16.
 */

import React from 'react';
import {Route, IndexRoute} from 'react-router';

import IndexPage from './containers/IndexPage';
import Conversation from './containers/Conversation';

export default (
    <Route path="/" component={IndexPage}>
        <IndexRoute component={Conversation} />
    </Route>
)