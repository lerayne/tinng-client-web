/**
 * Created by lerayne on 30.10.16.
 */

import React from 'react'

import css from './Topic.css'

export default function Topic({
    topic_name,
    updated
}) {
    return <div className={css.main}>
        {topic_name} <span style={{ float:'right' }}>{updated}</span>
    </div>
}