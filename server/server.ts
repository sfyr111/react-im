import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
const path = require('path')
const app = express()

// work with express
import * as socket from 'socket.io'
import * as http from 'http'

const server = new http.Server(app)
const io = socket(server)

import model from './model'
const Chat = model.getModel('chat')

// 监听连接
io.on('connection', function (socket) {
  console.log('user login')
  // socket 是当前连接的请求
  socket.on('sendmsg', function (data) {
    console.log(data);
    const { from, to, msg } = data
    const chatid = [ from, to ].sort().join('_')
    Chat.create({ chatid, from, to, content: msg, create_time: Date.now().valueOf() }, function (err: any, doc: any) {
      if (!err) {
        // io 是全局发送
        io.emit('recvmsg', Object.assign({}, doc._doc))
      }
    })
  })
})

import userRouter from './user'

app.use(cookieParser())
app.use(bodyParser.json())

app.use('/user', userRouter)
app.use(function (req, res, next) {
  if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
    return next()
  }
  
  return res.sendFile(path.resolve('build/index.html'))
})
app.use('/', express.static(path.resolve('build')))

server.listen(9090, function () {
  console.log('PORT=9090')
})
