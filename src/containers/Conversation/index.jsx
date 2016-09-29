/**
 * Created by lerayne on 26.09.16.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from './Conversation.css';

class Conversation extends Component {
    render(){
        return <div className={css.main}>
            {this.props.isFetching && 'fetching'}
            {!this.props.isFetching && 'fetch done'}
        </div>
    }
}

export default Conversation = connect(state => 
    ({
        isFetching: state.topics.isFetching
    })
)(Conversation)