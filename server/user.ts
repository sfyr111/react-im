import * as express from 'express'
import * as utils from 'utility'
import model from './model'

const Router = express.Router()
const User = model.getModel('user')
const Chat = model.getModel('chat')

const _filter = { 'pwd':0, '__v':0 }

Router.get('/list', function (req, res) {
  const { type } = req.query
  // User.remove({}, function () {})
  User.find({ type }, {}, function (_, doc) {
    res.json({ code: 0, data: doc })
  })
})

Router.get('/getmsglist', function (req, res) {
  const user = req.cookies.userid
  
  User.find({}, function (_, userDoc) {
    let users = {}
    userDoc.forEach((v: any) => {
      users[v._id] = { name: v.user, avatar: v.avatar}
    })
    Chat.find({ $or: [{ from: user }, { to: user }] }, function (err, doc) {
      if (!err) {
        res.json({ code: 0, msgs: doc, users: users })
      }
    })
  })
})

Router.post('/readmsg', function (req: any, res: any) {
  const userid = req.cookies.userid
  const { from } = req.body
  Chat.update({ from, to: userid }, { $set: { read: true } }, {/*修改多条*/ multi: true }, function (err, doc) {
    if (!err) {
      res.json({ code: 0, /*修改量*/ num: doc.nModified })
    } else {
      res.json({ code: 1, msg: '修改失败' })
    }
  })
})

Router.post('/update', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    res.json({ code: 1 })
  }
  const body = req.body
  User.findByIdAndUpdate(userid, body, function (_, doc: any) {
    const data = { user: doc.user, type: doc.type, ...body }
    res.json({ code: 0, data })
  })
})

Router.post('/login', function (req, res) {
  const { user, pwd } = req.body
  console.log(req.body.user)
  User.findOne({ user, pwd: md5Pwd(pwd) }, _filter, function (_: any, doc: any) {
    if (!doc) {
      res.json({ code: 1, msg: '用户名或密码错误' })
    }
    res.cookie('userid', doc._id)
    res.json({ code: 0, data: doc })
  })
})

Router.post('/register', function (req, res) {
  const { user, pwd, type } = req.body
  User.findOne({ user }, function (_, doc) {
    if (doc) {
      res.json({ code: 1, msg: '用户名重复' })
    }

    const userModel = new User({ user, type, pwd: md5Pwd(pwd) })
    userModel.save(function (err: any, doc: any) {
      if (err) {
        res.json({ code: 1, msg: '后端出错' })
      }
      const { user , type, _id } = doc
      res.cookie('userid', _id)
      res.json({ code: 0, data: { user , type, _id } })
    })
  })
})

Router.get('/info', function (req, res) {
  const { userid } = req.cookies
  if (!userid) {
    res.json({ code: 1 })
  }
  User.findOne({ _id: userid }, _filter, function (err: any, doc: any) {
    if (err) {
      res.json({ code: 1, msg: '后端出错' })
    }
    if (doc) {
      res.json({ code: 0, data: doc })
    }
  })
})

function md5Pwd (pwd: string) {
  const salt = 'yangranisgood'
  return utils.md5(utils.md5(pwd + salt))
}

export default Router
