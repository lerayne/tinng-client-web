/**
 * Created by lerayne on 17.01.17.
 */

/**
 * Redux middleware that performs Promise functionality.
 * @param getState
 * @param dispatch
 * @returns function
 */
export default function promiseMiddleware({getState, dispatch}) {
    return next => action => {
        // Expects action to have "promise" field.
        // If none - throws it to next middleware with correct return policy.
        if (!action.promise) {
            return next(action)
        } else {
            // Pass the action itself to the next MW transparently (allows to do smthng on request)
            next(action)

            const {type, promise, payload, ...rest} = action

            // Copies all initial info to a new action
            const newAction = {
                ...rest,
                initialType: type,
            }

            if (payload !== undefined) {
                newAction.initialPayload = payload
            }

            // Returns a fulfilled promise, where value is true/false depending on success/failure
            return promise.then(
                result => {
                    // todo next instead of dispatch - good or bad?
                    next({
                        ...newAction,
                        type: type + '_SUCCESS',
                        payload: result
                    })

                    return true
                },
                error => {
                    console.error(error)

                    // todo: same here
                    next({
                        ...newAction,
                        type: type + '_FAILURE',
                        payload: error
                    })

                    return false
                }
            )
        }
    }
}