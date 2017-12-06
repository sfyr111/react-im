import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import NavLinkBar from '../navlink/navlink'
import Boss from '../../component/boss/boss'
import Genius from '../../component/genius/genius'
import User from '../../component/user/user'
import Msg from '../../component/msg/msg'
import { getMsgList, recvMsg } from '../../redux/chat.redux'
import QueueAnim from 'rc-queue-anim'

// 本身是Router 组件，不需要withRoute, 可以使用 this.props 查看当前路由信息
@(connect(
  (state: any) => state,
  { getMsgList, recvMsg }
) as any)
class Dashboard extends React.Component<any, any> {
  
  componentDidMount () {
    // socket 多次绑定判断
    if (!this.props.chat.chatMsg.length) {
      this.props.getMsgList()
      this.props.recvMsg()
    }
  }

  render () {
    const { pathname } = this.props.location
    const user = this.props.user
    const navList: any[] = [
      {
        path: '/boss',
        text: '牛人', // 看到牛人列表
        icon: 'boss',
        title: '牛人列表',
        component: Boss,
        hide: user.type === 'genius' // 牛人时隐藏
      },
      {
        path: '/genius',
        text: 'boss', // 看到牛人列表
        icon: 'job',
        title: 'BOSS列表',
        component: Genius,
        hide: user.type === 'boss' // boss时隐藏
      },
      {
				path:'/msg',
				text:'消息',
				icon:'msg',
				title:'消息列表',
				component: Msg
			},
			{
				path:'/me',
				text:'我',
				icon:'user',
				title:'个人中心',
				component: User
			}
    ]
    const page = navList.find((v: any) => v.path === pathname)
    return (
      <div>
        <NavBar className='fixd-header' mode='dark'>
          {page ? page.title : '' }
        </NavBar>
        <div style={{ marginTop: 45 }}>
          {/* 路由动画生效只能针对一个标签 */}
          <QueueAnim type='scaleX' duration={800}>
            {/* <Switch> */}
            {page ? <Route key={page ? page.path : ''} path={page ? page.path : '/login'} component={page ? page.component : null} /> : <Redirect to='/login' />}
              {/* {navList.map((v: any) => (
                <Route key={v.path} path={v.path} component={v.component} />
              ))} */}
            {/* </Switch> */}
          </QueueAnim>
        </div>
        <NavLinkBar data={navList} />
      </div>
    )
  }
}

export default Dashboard
