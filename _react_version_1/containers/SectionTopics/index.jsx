/**
 * Created by lerayne on 02.11.16.
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'

import {subscribeOnTopics, goToTopic} from '../../actions/topics'
import {goToUser} from '../../actions/user'
import Topic from '../../components/Topic'
import Scrollable from '../../components/Scrollable'

import css from './SectionTopics.css'

class SectionTopics extends Component {
    componentDidMount() {

        const {dispatch} = this.props

        dispatch(subscribeOnTopics('topics_list'))
    }

    render() {
        const {dispatch, children, list, isFetching} = this.props

        return <div className={css.main}>
            {isFetching && 'fetching'}
            <Scrollable>
                {list.map(topic =>
                    <Topic
                        key={topic.id}
                        onTopicClick={id => dispatch(goToTopic(id))}
                        onAuthorClick={id => dispatch(goToUser(id))}
                        {...topic}
                    />
                )}
            </Scrollable>
        </div>
    }
}

export default SectionTopics = connect(state => ({

    isFetching: state.topics.isFetching,
    list: state.topics.list

}))(SectionTopics)