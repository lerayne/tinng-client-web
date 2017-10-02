/**
 * Created by lerayne on 09.05.17.
 */

export const defaultUserState = {
    id: -1
}

export default function userReducer(state=defaultUserState, action){
    const {type, payload} = action

    switch (type) {
        case 'SET_USER':
            console.log('set_user payload', payload)
            return {
                ...state,
                ...payload
            }

        default:
            return state
    }
}