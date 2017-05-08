/**
 * Created by lerayne on 22.11.16.
 */

import {push} from 'react-router-redux'

export function goToUser(id){
    return function (dispatch) {
        dispatch(push(`/user/${id}`))
    }
}