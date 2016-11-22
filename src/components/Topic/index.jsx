/**
 * Created by lerayne on 30.10.16.
 */

import React from 'react'
import classNames from 'classnames'

import {pDef} from '../../helpers/functions'
import css from './Topic.css'

export default function Topic(props) {
    const {
        id,
        topic_name,
        author,
        author_id,

        onTopicClick,
        onAuthorClick
    } = props

    const mainClasses = classNames(css.main, 'revealer-1')

    return <div className={mainClasses}>

        <header>
            <a
                href="#"
                className="author"
                onClick={e => pDef(e, () => onAuthorClick(author_id))}
            >
                {author}
            </a>

            <div className="reveal-1 right date">
                {!!props.modified && <span>Изменено </span>}
                {props.modified || props.created}
            </div>

        </header>

        <section>
            <a
                href="#"
                className="title"
                onClick={e => pDef(e, () => onTopicClick(id))}
            >
                {topic_name}
            </a>
        </section>
    </div>
}