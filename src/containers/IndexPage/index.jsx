/**
 * Created by lerayne on 31.03.16.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from './IndexPage.css';

class IndexPage extends Component {
    constructor(props){
        super(props)

        console.log('main props', props)
    }

    render() {
        return <div className={css.main}>
            <div className="main-toolbar"></div>
            <div className="main-viewport"></div>
        </div>
    }
}

export default connect()(IndexPage);