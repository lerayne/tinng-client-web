/**
 * Created by lerayne on 26.09.16.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from './Conversation.css';

import {SUBSCRIBE_TOPICS, SUBSCRIBE_TOPICS_SUCCESS, SUBSCRIBE_TOPICS_ERROR} from '../../actions/topics'
import {stopConnection, startConnection} from '../../actions/global'

class Conversation extends Component {

    componentDidMount(){
        this.props.dispatch({
            type: SUBSCRIBE_TOPICS,
            subscription:{
                name: 'topics_list',
                contentType: 'topics',
                turn: 'on',
                onReceiveData: ::this.onReceive
            },
            payload:{
                searchString: null
            }
        })
    }

    render(){

        const {dispatch} = this.props;

        return <div className={css.main}>
            {this.props.isFetching && 'fetching'}
            {!this.props.isFetching && 'fetch done'}

            <button onClick={() => dispatch(stopConnection())}>Stop</button>
            <button onClick={() => dispatch(startConnection())}>Start</button>
        </div>
    }

    onReceive(data){
        console.log('Conversation.onReceive', data)
    }
}

export default Conversation = connect(state => ({
    isFetching: state.topics.isFetching
}))(Conversation)