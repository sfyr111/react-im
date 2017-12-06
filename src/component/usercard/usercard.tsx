import React from 'react'
import PropTypes from 'prop-types'
import { Card, WhiteSpace, WingBlank } from 'antd-mobile'
import { withRouter } from 'react-router-dom'

@withRouter
class UserCard extends React.Component<any, any> {
  static propTypes = { // 类型检测
    userList: PropTypes.array.isRequired
  }

  handleClick (v: any) {
    this.props.history.push(`/chat/${v._id}`)
  }

  render () {
    const Header = Card.Header
    const Body = Card.Body
    return (
      <WingBlank>
        <WhiteSpace />
        {this.props.userList.map((v: any) => (
          v.avatar 
          ? <Card
              onClick={()=>this.handleClick(v)}
              key={v._id}
            >
              <Header
                title={v.user}
                thumb={require(`../img/${v.avatar}.png`)}
                extra={<span>{v.title}</span>}
              ></Header>
              <Body>
                {v.type === 'boss' ? <div>公司:{v.company}</div> : null}
                {v.desc.split('\n').map((d: any) => (
                  <div key={d}>{d}</div>
                ))}
                {v.type === 'boss' ? <div>薪资:{v.money}</div> : null}
              </Body>
            </Card> : null
        ))}
      </WingBlank>
    )
  }
}

export default UserCard
