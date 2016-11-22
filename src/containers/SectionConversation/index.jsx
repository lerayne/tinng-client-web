/**
 * Created by lerayne on 22.11.16.
 */

import React, {Component} from 'react'

export default class SectionConversation extends Component {
    render(){
        return <div>{this.props.params.topicId}</div>
    }
}