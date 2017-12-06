import React from 'react'
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile'
import AvatarSelector from '../../component/avatar-selector/avatar-selector'
import { connect } from 'react-redux'
import { update } from '../../redux/user.redux'
import { Redirect } from 'react-router';
@(connect(
  (state: any) => state.user,
  { update }
) as any)
class GeniusInfo extends React.Component<any, any> {
  constructor (props: any) {
    super(props)
    this.state = {
      title: '',
      desc:''
    }
  }

  onChange (key: string, val: string) {
    this.setState({
      [key]: val
    })
  }

  render () {
    const path = this.props.location.pathname
    const redirect = this.props.redirectTo
    return (
      <div>
        {redirect && redirect !== path ? <Redirect to={this.props.redirectTo} /> : null}
        <NavBar mode="dark">牛人完善信息页面</NavBar>
        <AvatarSelector
          selectAvatar={(imgName: string) => {
            this.setState({
              avatar: imgName
            })
          }}
        ></AvatarSelector>
        <InputItem
          onChange={(v: any) => this.onChange('title', v)}
        >求职岗位
        </InputItem>
        <TextareaItem
          onChange={(v: any) => this.onChange('desc', v)}
          rows={3}
          autoHeight
          title='个人简介'
        />
        <Button
          onClick={() => {
            this.props.update(this.state)
          }}
          type='primary'
        >保存</Button>
      </div>
    )
  }
}

export default GeniusInfo
