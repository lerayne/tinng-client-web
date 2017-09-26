/**
 * Created by lerayne on 09.05.17.
 */

import socketClient from 'socket.io-client'
window.config.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwibmFtZSI6ImFkbWluIiwiZGlzcGxheU5hbWUiOiJBZG1pbiIsImlhdCI6MTUwMjc0MDg3OCwiZXhwIjoxNTAyNzQ0NDc4fQ.SFmHFHjIPxrDdLUHIfXu6ATDtqu0Of2KrE7SGmYsxho'

class Connection {
    constructor(config) {

        const {tinngServerURL, token} = config

        this.socket = socketClient(tinngServerURL)

        this.userReady = new Promise((resolve, reject) => {
            this.on('connect', () => {

                this.emit('authenticate', {token})
                    .on('authorized', user => {
                        resolve(user)
                    })
                    .on('unauthorized', err => {
                        reject(err)
                    })
            })
        })

        this.userReady
            .then(user => {
                console.info('user recognized', user)
            })
            .catch(err => {
                console.warn('socket auth error', err)
            })
    }

    on(...args) {
        return this.socket.on(...args)
    }

    emit(...args) {
        return this.socket.emit(...args)
    }
}

const connection = new Connection(window.config)


/*const socket = socketClient(window.config.tinngServerURL, {
 query: 'token=' + token
 })*/

export default connection