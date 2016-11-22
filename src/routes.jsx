/**
 * Created by lerayne on 20.09.16.
 */

import React from 'react';
import {Route, IndexRoute} from 'react-router';

import IndexPage from './containers/IndexPage';
import PageConversation from './containers/PageConversation';
import SectionConversation from './containers/SectionConversation';

const routes = (
    <Route path="/" component={IndexPage}>
        <IndexRoute component={PageConversation} />
        <Route component={PageConversation}>
            <Route path="topic/:topicId" component={SectionConversation} />
        </Route>
        <Route path="user(/:id)"/>
    </Route>
)

export default routes