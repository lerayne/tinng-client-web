/**
 * Created by lerayne on 09.05.17.
 */

import socketClient from 'socket.io-client'
window.config.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwibmFtZSI6ImFkbWluIiwiZGlzcGxheU5hbWUiOiJBZG1pbiIsImlhdCI6MTQ5NzUzNjcyMywiZXhwIjoxNDk3NTQwMzIzfQ.ACXEH9d9bTIrq-YbH4T5H3lvEKoaMxWnB9FGFHR0yNo'

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
            .catch(error => {
                console.warn('auth error')
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