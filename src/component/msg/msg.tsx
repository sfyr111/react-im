import React from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'

declare global {
  interface Object { values: any }
}

@(connect(
  (state: any) => state
) as any)
class Msg extends React.Component<any, any> {
  
  getLast (arr: object[]): any {
    return arr[arr.length - 1]
  }

  render () {

    const Item = List.Item
    const Brief = Item.Brief
    const userid = this.props.user._id
    const userinfo = this.props.chat.users
    // 字典结构
    const msgGroup: object = {}
    this.props.chat.chatMsg.forEach((v: {chatid: string}) => {
      msgGroup[v.chatid] = msgGroup[v.chatid] || [] // array
      msgGroup[v.chatid].push(v)
    })
    const chatList = Object.values(msgGroup).sort((a: any[], b: any[]) => {
      const a_last = this.getLast(a).create_time
      const b_last = this.getLast(b).create_time
      return b_last - a_last
    })
    
    // 按照聊天用户分组，根据chatid
    return (
      <div>
          {chatList.map((v: {from: string, to: string}[]) => {
            const lastItem: any = this.getLast(v)
            const targetId = v[0].from === userid ? v[0].to : v[0].from
            const unreadNum = v.filter((d: {from: string, to: string, read: string}) => !d.read && (d.to === userid)).length
            if (!userinfo[targetId]) return null
            return (
              <List key={lastItem._id}>
                <Item
                  extra={<Badge text={unreadNum} />}
                  thumb={require(`../img/${userinfo[targetId].avatar}.png`)}
                  arrow='horizontal'
                  onClick={() => {
                    this.props.history.push(`/chat/${targetId}`)
                  }}
                >
                  {lastItem.content}
                  <Brief>{userinfo[targetId].name}</Brief>
                </Item>
              </List>
            )
          })}
      </div>
    )
  }
}

export default Msg
