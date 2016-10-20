/**
 * Created by lerayne on 26.09.16.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from './Conversation.css';

import {SUBSCRIBE_TOPICS, SUBSCRIBE_TOPICS_SUCCESS, SUBSCRIBE_TOPICS_ERROR} from '../../actions/topics'

class Conversation extends Component {

    componentDidMount(){
        this.props.dispatch({
            type: SUBSCRIBE_TOPICS,
            subscription:{
                content: 'topics',
                turn:'on',
                onReceive: SUBSCRIBE_TOPICS_SUCCESS,
                onFailure: SUBSCRIBE_TOPICS_ERROR
            }
        })
    }

    render(){
        return <div className={css.main}>
            {this.props.isFetching && 'fetching'}
            {!this.props.isFetching && 'fetch done'}
        </div>
    }
}

export default Conversation = connect(state => ({
    isFetching: state.topics.isFetching
}))(Conversation)