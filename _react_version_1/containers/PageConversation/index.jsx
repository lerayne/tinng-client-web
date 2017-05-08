/**
 * Created by lerayne on 26.09.16.
 */

// todo - если не будет связи со стейтом - переделать в компонент

import React, {Component} from 'react';
import {connect} from 'react-redux';

import SectionTopics from '../SectionTopics'

class PageConversation extends Component {

    render() {

        const mainStyle = {
            height: 'calc(100% - 30px)'
        }

        return <div style={mainStyle}>
            <SectionTopics />
            <div>{this.props.children}</div>
        </div>
    }
}

export default PageConversation = connect(state => ({}))(PageConversation)