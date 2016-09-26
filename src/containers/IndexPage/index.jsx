/**
 * Created by lerayne on 31.03.16.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from './IndexPage.css';

class IndexPage extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return <div className={css.main}>
            <div className="main-toolbar"></div>
            <div className="main-viewport">
                {this.props.isFetching && 'fetching new page'}
        </div>
    }
}

export default connect(state => ({
    isFetching: state.topics.isFetching
}))(IndexPage);