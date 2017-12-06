import axios from 'axios'
import io from 'socket.io-client'

const socket = io('ws://localhost:9090')

// 获取聊天列表
const MSG_LIST = 'MSG_LIST'
// 读取信息
const MSG_RECV = 'MSG_RECV'
// 标识已读
const MSG_READ = 'MSG_READ'

const initState = {
  chatMsg: [],
  users: {},
  unread: 0
}

export function chat (state = initState, action: any) {
  switch (action.type) {
    case MSG_LIST:
      return { ...state, users: action.payload.users, chatMsg: action.payload.msgs, unread: action.payload.msgs.filter((v: any) => !v.read && v.to === action.payload.userid).length }
    case MSG_RECV:
      const n: number = action.payload.to === action.userid ? 1 : 0
      return { ...state, chatMsg: [ ...state.chatMsg, action.payload ], unread: state.unread + n }
    case MSG_READ:
      const { from, num } = action.payload
      return { ...state, chatMsg: state.chatMsg.map((v: any) => ({ ...v, read: from === v.from ? true : v.read })), unread: state.unread - num }
    default:
      return state
  }
}

// action
function msgList (msgs: any, users: any, userid: any) {
  return { type: MSG_LIST, payload: { msgs, users, userid } }
}

function msgRecv (msg: any, userid: any) {
  return { type: MSG_RECV, payload: msg, userid } // 换一种写法
}

function msgRead (data: { from: string, /*当前用户*/ userid: string, num: number }) {
  const { from, userid, num } = data
  return { type: MSG_READ, payload: { from, userid, num } } // 换一种写法
}

export function readMsg (from: string) {
  return (dispatch: any, getState: any) => {
    axios.post('/user/readmsg', { from })
      .then((res: any) => {
        const userid = getState().user._id
        if (res.status === 200 && res.data.code === 0) {
          dispatch(msgRead({ from, userid, num: res.data.num }))
        }
      })
  }
}

export function recvMsg () {
  return (dispatch: any, getState: any) => {
    // socket 会多次绑定 在外面要判断
    socket.on('recvmsg', function (data: any) {
      console.log('recvmsg', data)
      const userid = getState().user._id
      dispatch(msgRecv(data, userid))
    })
  }
}

// action create 必须返回函数
export function sendMsg (data: { from: string, to: string, msg: string }) {
  const { from, to, msg } = data
  return (_: any) => {
    socket.emit('sendmsg', { from, to, msg })
  }
}

export function getMsgList () {
  // 第二个参数是获取所有state
  return (dispatch: any, getState: any) => {
    axios.get('/user/getmsglist')
      .then((res: any) => {
        if (res.status === 200 && res.data.code === 0) {
          const userid = getState().user._id
          dispatch(msgList(res.data.msgs, res.data.users, userid))
        }
      })
  }
}
