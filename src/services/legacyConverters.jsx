/**
 * Created by lerayne on 30.10.16.
 */

export function transformFromLegacyResponse (oldResponse) {
    try {

        const newResponse = {}

        if (oldResponse.data) {

            const {data} = oldResponse;

            if (data.meta && data.meta[0]) {
                newResponse.meta = data.meta[0]
            }

            if (data.feeds && data.feeds[0]) {
                newResponse.data = data.feeds[0]
            }
        }

        return newResponse;

    } catch (error) {
        throw error
    }
}

export function transformToLegacyBody(newBody) {

    const subscriberMeta = {};
    const subscriber = {};

    for (let name in newBody.subscriptions) {

        const {meta, payload, contentType} = newBody.subscriptions[name];

        subscriberMeta[name] = meta;

        subscriber[name] = {...payload}
        subscriber[name].feed = contentType
    }

    const legacyBody = {
        subscribe: [subscriber],
        meta: [subscriberMeta],
    }

    if (newBody.actions) {
        legacyBody.write = newBody.actions
    }

    //console.log('legacyBody', {...legacyBody})

    return legacyBody
}