import * as mongoose from 'mongoose'

const url = 'mongodb://localhost:27017/imooc-chat'
mongoose.connect(url)

const models = {
  user: {
    user: { type: String, require: true },
    pwd: { type: String, require: true },
    type: { type: String, require: true },
    // 头像
    avatar: { type: String },
    // 简介
    desc: { type: String },
    // 职位名
    title: { type: String },
    // boss 字段
    company: { type: String },
    money: { type: String }
  },
  chat: {
    chatid: { type: String, require: true }, // 聊天的唯一标示
    from: { type: String, require: true },
    to: { type: String, require: true },
    read: { type: Boolean, default: false }, // 已读，只对to 用户有效
    content: { type: String, require: true, default: '' },
    create_time: { type: Number, default: Date.now().valueOf() },
  }
}

for (let m in models) {
  mongoose.model(m, new mongoose.Schema(models[m]))
}

export default {
  getModel: function (name: any) {
    return mongoose.model(name)
  }
}
