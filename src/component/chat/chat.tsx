import React from 'react'
import { List, InputItem, NavBar, Icon, Grid } from 'antd-mobile'
import { connect } from 'react-redux'
import { sendMsg, getMsgList, recvMsg, readMsg } from '../../redux/chat.redux'
import { getChatId } from '../../util'
import QueueAnim from 'rc-queue-anim'

@(connect(
  (state: any) => state,
  { sendMsg, getMsgList, recvMsg, readMsg }
) as any)
class Chat extends React.Component<any, any> {
  constructor (props: any) {
    super(props)
    this.state = {
      text: '',
      // msg: [],
      showEmoji: false
    }
  }

  componentDidMount () {
    if (!this.props.chat.chatMsg.length) {
      this.props.getMsgList()
      this.props.recvMsg()
    }
  }
  
  // 组件退出时， 路由退出时
  componentWillUnmout () {
    const to = this.props.match.params.user
    this.props.readMsg(to) // 已读消息
  }

  fixCarousel () {
    setTimeout(() => {
      // 手动派发一个resize 事件，解决Grid 的轮播bug
      window.dispatchEvent(new Event('resize'))
    }, 0)
  }

  handleSubmit () {
    // socket.emit('sendmsg', { text: this.state.text })
    const from = this.props.user._id
    const to = this.props.match.params.user // match 是router 里面的参数
    const msg = this.state.text
    this.props.sendMsg({ from, to, msg })
    this.setState({ text: '' })
  }

  render () {
		const emoji = '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐 😷 🤒 🤕 😈 👿 👹 👺 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 👐 🙌 👏 🙏 👍 👎 👊 ✊ 🤘 👌 👈 👉 👆 👇 ✋  🖐 🖖 👋  💪 🖕 ✍️  💅 🖖 💄 💋 👄 👅 👂 👃 👁 👀 '
      .split(' ')
      .filter((v: any) => v)
      .map((v: any) => ({ text: v }))

    const userId = this.props.match.params.user
    const Item = List.Item
    const users = this.props.chat.users
    if (!users[userId]) {
      return null
    }
    const chatid = getChatId(userId, this.props.user._id)
    const chatMsgs = this.props.chat.chatMsg.filter((v: any) => v.chatid === chatid)
    return (
      <div id='chat-page'>
        <NavBar 
          mode='dark'
          icon={<Icon type='left' />}
          onLeftClick={() => {
            this.props.history.goBack()
          }}
        >
          {users[userId].name}
        </NavBar>

        <QueueAnim delay={100}>
          {chatMsgs.map((v: any) => {
            const avatar = require(`../img/${users[v.from].avatar}.png`)
            return v.from === userId ? (
              <List key={v._id}>
                <Item
                  thumb={avatar} // 左边直接用
                >{v.content}</Item>
              </List>
            ) : (
              <List key={v._id}>
              <Item 
                className='chat-me'
                extra={<img src={avatar} />}
              >{v.content}</Item>
            </List>
            )
          })}
        </QueueAnim>

        <div className='stick-footer'>
          <List>
            <InputItem
              placeholder='请输入'
              value={this.state.text}
              onChange={(v: any) => {
                this.setState({ text: v })
              }}
              extra={
                <div>
                  <span
                    style={{marginRight: 15}}
                    onClick={() => {
                      this.setState({
                        showEmoji: !this.state.showEmoji
                      })
                      this.fixCarousel()
                    }}
                  >😀</span>
                  <span onClick={() => this.handleSubmit()}>发送</span>
                </div>
              }
            >信息</InputItem>
          </List>
          {this.state.showEmoji 
          ? <Grid 
              data={emoji}
              columnNum={9}
              carouselMaxRow={4}
              isCarousel={true}
              onClick={(el: {text: string}) => {
                this.setState({
                  text: this.state.text + el.text
                })
              }}
            /> : null}
          
        </div>
      </div>
    )
  }
}

export default Chat
