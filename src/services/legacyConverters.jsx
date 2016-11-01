/**
 * Created by lerayne on 30.10.16.
 */

export function transformFromLegacyResponse(oldResponse) {
    try {

        const newResponse = {}

        if (oldResponse.data) {

            const {data} = oldResponse;

            if (data.meta && data.meta[0]) {

                for (let name in data.meta[0]) {

                    if (!newResponse[name]) {
                        newResponse[name] = {}
                    }

                    newResponse[name].meta = data.meta[0][name]
                }
            }

            if (data.feeds && data.feeds[0]) {

                for (let name in data.feeds[0]) {

                    if (!newResponse[name]) {
                        newResponse[name] = {}
                    }

                    newResponse[name].payload = data.feeds[0][name]
                }
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