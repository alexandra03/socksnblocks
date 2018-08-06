const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const firebase = require('./firebase.js');
const config = require('../config.json');

const port = config.socketIOPort;

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

const db = firebase.firestore();


io.on('connection', socket => {
    socket.on('disconnect', () => { handleDisconnect(socket) });

    socket.on('role chosen', (role) => { handleRoleChosen(socket, role) });

    socket.on('host code entered', (code) => { handleHostCodeEntered(socket, code) });
});

updatePlayerCount = (socket, host, doc, incr) => {
    let players = doc.data().players;

    players = incr ? players + 1 : players - 1;
    
    host.update({players}).then(
        () => { 
            let data = {
                host_id: socket.host_id,
                players: players
            };
            socket.broadcast.emit('players updated', data);
        }
    );
};

handleDisconnect = (socket) => {
    if (socket.host_id === undefined) return;

    let host = db.collection('hosts').doc(socket.host_id);

    if (socket.is_host) {
        host.delete().then(
            () => {
                socket.broadcast.emit('host disconnected', socket.host_id);
            }
        );
    } else {
        host.get().then(
            (doc) => {
                if (doc.exists) {
                    updatePlayerCount(socket, host, doc, false);
                }
            }
        )
    }
};

handleRoleChosen = (socket, role) => {
    if (role === 'host') {
        let host_id = '1234';

        let host = db.collection('hosts').doc(host_id);

        host.set({
            created: Date.now(),
            players: 0,
            observers: 0,
        }).then((doc) => {
            socket.is_host = true;
            socket.host_id = host_id;
            socket.emit('host code', host_id);
        });
    } else {
        socket.is_host = false;
    }
};

handleHostCodeEntered = (socket, code) => {
    let host = db.collection('hosts').doc(code);

    host.get().then(
        (doc) => {
            if (doc.exists) {
                socket.host_id = code;
                updatePlayerCount(socket, host, doc, true);
            }
            socket.emit('host joined', doc.exists);
        }
    );
};

server.listen(port, () => console.log('listening'));
