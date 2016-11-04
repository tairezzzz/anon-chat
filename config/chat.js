const mongoose = require('mongoose');

module.exports = (io) => {
    console.log(`SocketIO up...`);
    io.on('connection', socket => {
        console.log('connected');
        socket.on('login', user => {
            io.broadcast.emit('message', 'new user connected');
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('message', msg => {
            console.log(`send message: ${msg}`);
            io.emit('message', msg);
        });
    })
};
/*

const users = [];

io.use((socket, next) => {
    let _token = socket.handshake.query.token;
    console.log(`SocketIO > get token: ${_token}`);

    if (!_token) {
        next();
        return;
    }
    dbConnection.query('SELECT id, auth_key FROM user WHERE auth_key = ?', [_token], (error, rows) => {
        if (error) {
            console.error(`error connecting: ${error.stack}`);
            return;
        }
        if (!rows.length) {
            console.log(`error: user not found`);
            return;
        }
        users.push({
            id: rows[0].id,
            token: rows[0].auth_key,
            socketID: socket.id
        });
        socket.join(rows[0].id);

        console.log(users);
    });
    next();
})
    .on('connection', socket => {
        console.log(`SocketIO > Connected socket ${socket.id}`);

        socket.on('server-event', message => {
            console.log(`ElephantIO > send ${JSON.stringify(message)}`);

            let user = users.find(user => user.id == message.idReciever);
            if (user) {
                io.to(user.id).emit('client-event', message.data);
            }
        });

        socket.on('deployment', message => {
            console.log(`ElephantIO > send ${JSON.stringify(message)}`);

            let user = users.find(user => user.id == message.idReciever);
            if (user) {
                io.to(user.id).emit('client-deployment', message.data);
            }
        });

        socket.on('disconnect', () => {
            console.log(`SocketIO > Disconnected socket ${socket.id}`);
            let closedUserIndex = users.findIndex(user => user.socketID == socket.id);
            if (closedUserIndex + 1) {
                users.splice(closedUserIndex, 1);
            }
            console.log(users);
        });

        socket.on('out', () => {
            socket.disconnect();
        })
    });
*/
