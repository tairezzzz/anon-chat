const mongoose = require('mongoose'),
    Chat = require('../app/models/chat');

module.exports = (io) => {
    console.log(`SocketIO up...`);
    io.on('connection', socket => {
        console.log(`'connected ${socket}`);

        socket.on('login', user => {
            io.broadcast.emit('message', 'new user connected');
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('message', data => {
            console.log(`send message: ${data.msg} to ${data.room} room`);
            var newMsg = new Chat({
                content: data.msg,
                room: data.room.toLowerCase(),
                created: new Date()
            });
            newMsg.save((err, msg) => {
                if (err) throw err;
                io.to(msg.room).emit('message', msg.content);
            });
        });
        socket.on('switch room', data => {
            console.log(`switching room form ${data.leaveRoom} to ${data.joinRoom}`);
            socket.leave(data.leaveRoom);
            socket.join(data.joinRoom);
            io.in(data.leaveRoom).emit('user left', data);
            io.in(data.joinRoom).emit('user joined', data);

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
