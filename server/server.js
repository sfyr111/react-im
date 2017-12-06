"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require('path');
const app = express();
// work with express
const socket = require("socket.io");
const http = require("http");
const server = new http.Server(app);
const io = socket(server);
const model_1 = require("./model");
const Chat = model_1.default.getModel('chat');
// 监听连接
io.on('connection', function (socket) {
    console.log('user login');
    // socket 是当前连接的请求
    socket.on('sendmsg', function (data) {
        console.log(data);
        const { from, to, msg } = data;
        const chatid = [from, to].sort().join('_');
        Chat.create({ chatid, from, to, content: msg, create_time: Date.now().valueOf() }, function (err, doc) {
            if (!err) {
                // io 是全局发送
                io.emit('recvmsg', Object.assign({}, doc._doc));
            }
        });
    });
});
const user_1 = require("./user");
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/user', user_1.default);
app.use(function (req, res, next) {
    if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
        return next();
    }
    return res.sendFile(path.resolve('build/index.html'));
});
app.use('/', express.static(path.resolve('build')));
server.listen(9090, function () {
    console.log('PORT=9090');
});
