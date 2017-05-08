/**
 * Created by lerayne on 31.03.16.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {stopConnection, startConnection, test} from '../../actions/global'

import css from './IndexPage.css';

class IndexPage extends Component {

    render() {

        const {dispatch} = this.props;

        return <div className={css.main}>
            <div className="main-toolbar">
                <button onClick={() => dispatch(stopConnection())}>Stop</button>
                <button onClick={() => dispatch(startConnection())}>Start</button>
                <button onClick={() => dispatch(test())}>test</button>
            </div>
            {this.props.children}
        </div>
    }
}

export default IndexPage = connect()(IndexPage);