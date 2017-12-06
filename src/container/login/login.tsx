import React from 'react'
import Logo from '../../component/logo/logo'
import { List, InputItem, WingBlank, WhiteSpace, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import { login } from '../../redux/user.redux'
import { Redirect } from 'react-router-dom'
import iForm from '../../component/iform/iform'

/* 高阶组件demo1
  function hello () {
    console.log('hhhha');
  }

  function WrapperHello (fn: Function) {
    return function () {
      console.log('before say hhha');
      fn.call(null)
      console.log('after say hhha'); 
    }
  }

  const hhh = WrapperHello(hello)
  hhh()
*/

/* 高阶组件demo2
  function WrapperHello (Comp: any) {
    class WrapComp extends Comp { // 反向继承
      componentDidMout () {
        console.log('高阶组件改写生命周期')
      }
      render () {
        return <Comp></Comp>
      }
    }
    class WrapComp extends React.Component {

      render () {
        return (<div>
          <p>这是HOC的元素</p>
          // 属性代理
          <Comp name='text'>{...this.props}</Comp>
        </div>)
      }
    }
    return WrapComp
  }

  @WrapperHello // 写法2
  class Hello extends React.Component  {
    render () {
      return <h2>hello HCOMPONENT</h2>
    }
  }

  // const WHello = WrapperHello(Hello) // 写法1
*/

@(connect(
  (state: any) => state.user,
  { login }
) as any)
@(iForm as any)
class Login extends React.Component<any> {
  constructor (props: any) {
    super(props)
    // this.state = { // 改为HOC 传递
    //   user: '',
    //   pwd: ''
    // }
    this.register = this.register.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  register () {
    this.props.history.push('/register')
  }

  // handleChange (key: string, val: string) {
  //   this.setState({
  //     [key]: val
  //   })
  // }

  handleLogin () {
    const { login } = this.props
    login(this.props.state) // HOC传来的
  }

  render () {
    return (
      <div>
        {/* <Hello /> */}
        {/* <WHello /> */}
        {(this.props.redirectTo && this.props.redirectTo !== '/login') ? <Redirect to={this.props.redirectTo} /> : null}
        <Logo />
        <WingBlank>
          {this.props.msg ? (<p className='error-msg'>{this.props.msg}</p>) : null} 
          <List>
            <InputItem
              // 改为HOC 传递
              onChange={(v: any) => this.props.handleChange('user', v)}
            >用户</InputItem>
            <WhiteSpace />
            <InputItem
              type='password'
              onChange={(v: any) => this.props.handleChange('pwd', v)}
            >密码</InputItem>
          </List>
          <Button onClick={this.handleLogin} type='primary'>登陆</Button>
          <WhiteSpace />
          <Button onClick={this.register} type='primary'>注册</Button>
        </WingBlank>
      </div>
    )
  }
}

export default Login