/**
 * Created by lerayne on 31.03.16.
 */

import React, { Component } from 'react';

import css from './IndexPage.css';

class IndexPage extends Component {

    render() {
        return <div className={css.main}>
            <div className="main-toolbar"></div>
            {this.props.children}
        </div>
    }
}

export default IndexPage;