/**
 * Created by lerayne on 02.11.16.
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'

import {subscribeOnTopics} from '../../actions/topics'
import Topic from '../../components/Topic'

import css from './SectionTopics.css'

class SectionTopics extends Component {
    /*constructor(props) {
        super(props)

        this.state = {}
    }*/

    componentDidMount(){

        const {dispatch} = this.props

        dispatch(subscribeOnTopics('topics_list'));
    }

    render() {
        const {list, isFetching} = this.props

        return <div className={css.main}>
            {isFetching && 'fetching'}
            {list.map(topic =>
                <Topic key={topic.id} {...topic} />
            )}
        </div>
    }
}

export default SectionTopics = connect(state => ({

    isFetching: state.topics.isFetching,
    list: state.topics.list

}))(SectionTopics)