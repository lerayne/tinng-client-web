/**
 * Created by lerayne on 22.11.16.
 */

export function noProp(e, callback) {
    e.stopPropagation();
    callback(e)
}

export function pDef(e, callback){
    e.preventDefault();
    return callback(e);
}

export function stopAll(e, callback){
    e.preventDefault()
    e.stopPropagation()
    return callback(e)
}