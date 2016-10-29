/**
 * Created by lerayne on 26.09.16.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from './Conversation.css';

import Topic from '../../components/Topic'

import {
    SUBSCRIBE_TOPICS,
    receiveTopics
} from '../../actions/topics'

class Conversation extends Component {

    componentDidMount(){

        const {dispatch} = this.props;

        dispatch({
            type: SUBSCRIBE_TOPICS,
            subscription:{
                name: 'topics_list',
                contentType: 'topics',
                turn: 'on',
                onReceiveData: (data, actions) => dispatch(receiveTopics(data, actions))
            },
            payload:{
                searchString: null
            }
        })
    }

    render(){

        const {dispatch, list, isFetching} = this.props;

        return <div className={css.main}>
            {isFetching && 'fetching'}
            {list.map(topic =>
                <Topic key={topic.id} {...topic} />
            )}
        </div>
    }
}

export default Conversation = connect(state => ({
    isFetching: state.topics.isFetching,
    list: state.topics.list
}))(Conversation)