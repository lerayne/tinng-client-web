/**
 * Created by lerayne on 08.12.16.
 */

import React, {Component} from 'react'
import css from './Scrollable.css'

export default class Scrollable extends Component {
    constructor() {
        super()

        this.state = {
            scrollIsAtTop: false,
            scrollIsAtBottom: false
        }

        // binding here so that unmount cleanup would be possible
        this.handleScroll = this.handleScroll.bind(this)
    }

    componentDidUpdate(prevProps, prevState){
        this.handleScroll()
    }

    componentDidMount(){
        //also count the scrollbale state on window resize
        window.addEventListener('resize', this.handleScroll)
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.handleScroll)
    }

    render() {
        const {scrollIsAtTop, scrollIsAtBottom} = this.state

        return <div className={css.main}>
            <div
                className="scrollable"
                ref={el => this._scrollable = el}
                onScroll={this.handleScroll}
            >
                <div className="scrollBody">
                    {this.props.children}
                </div>
            </div>
            {!scrollIsAtTop && <div className="fade top"/>}
            {!scrollIsAtBottom && <div className="fade bottom"/>}
        </div>
    }

    handleScroll() {
        const {scrollTop, scrollHeight, offsetHeight} = this._scrollable
        const {scrollIsAtTop, scrollIsAtBottom} = this.state

        const scrollNowAtTop = scrollTop == 0
        const scrollNowAtBottom = scrollHeight - (scrollTop + offsetHeight) <= 0

        // check here is to avoid infinite update loop
        if (scrollIsAtBottom != scrollNowAtBottom || scrollIsAtTop != scrollNowAtTop){
            this.setState({
                scrollIsAtTop: scrollNowAtTop,
                scrollIsAtBottom: scrollNowAtBottom
            })
        }
    }
}