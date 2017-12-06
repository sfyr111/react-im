import React from 'react'
import Logo from '../../component/logo/logo'
import { List, InputItem, WhiteSpace, Radio, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { register } from '../../redux/user.redux'
import { Redirect } from 'react-router';
import iForm from '../../component/iform/iform'

// interface Props {}
// interface State { type:  string }

@(connect(
  (state: any) => state.user,
  { register }
) as any)
@(iForm as any)
class Register extends React.Component<any, any> {
  constructor (props: any) {
    super(props)
    this.state = {
      // user: '',
      // pwd: '',
      // repeatpwd: '',
      // type: 'genius' // boss
    }
    this.handleRegister = this.handleRegister.bind(this)
  }

  componentDidMount () {
    this.props.handleChange('type', 'genius') // HOC 先传递当前默认type
  }

  // handleChange (key: any, val: any) { // 迁移HOC
  //   this.setState({
  //     [key]: val
  //   })
  // }

  handleRegister () {
    const { register } = this.props
    register(this.props.state) // HOC 传递
  }

  render () {
    const RadioItem = Radio.RadioItem
    return (
      <div>
        {this.props.redirectTo ? <Redirect to={this.props.redirectTo} /> : null}
        <Logo />    
        {this.props.msg ? (<p className='error-msg'>{this.props.msg}</p>) : null}        
        <List>
          <InputItem
            onChange={(v: any) => this.props.handleChange('user', v)}
          >用户名
          </InputItem>
          <WhiteSpace />
          <InputItem
            type='password'
            onChange={(v: any) => this.props.handleChange('pwd', v)}
          >密码
          </InputItem>
          <WhiteSpace />
          <InputItem
            type='password'
            onChange={(v: any) => this.props.handleChange('repeatpwd', v)}
          >确认密码
          </InputItem>
          <WhiteSpace />
          <RadioItem
            checked={this.props.state.type === 'genius'} // HOC 传递
            onChange={() => this.props.handleChange('type', 'genius')}
          >牛人
          </RadioItem>
          <RadioItem
            checked={this.props.state.type === 'boss'}
            onChange={() => this.props.handleChange('type', 'boss')}
          >BOSS
          </RadioItem>
          <WhiteSpace />
          <Button
            type='primary'
            onClick={this.handleRegister}
          >注册</Button>
        </List>
      </div>
    )
  }
}

export default Register