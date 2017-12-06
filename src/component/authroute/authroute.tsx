import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadData } from '../../redux/user.redux'

@withRouter // 可以看到当前this.props.history 的信息
@(connect(
  null,
  { loadData }
) as any)
class AuthRoute extends React.Component<any, any> {
  componentDidMount (): null | any {
    const publicList = ['/login', '/register']
    const pathname = this.props.location.pathname
    if (publicList.indexOf(pathname) > -1) {
      return null // 在login register 下不需要获取用户信息
    }
    // 获取用户信息
    axios.get('/user/info')
      .then((res: any) => {
        if (res.status === 200) {
          if (res.data.code === 0) {
            // 有登陆信息
            this.props.loadData(res.data.data)
          } else {
            this.props.history.push('/login')
          }
        }
      })
  }

  render () {
    return null
  }
}

export default AuthRoute
