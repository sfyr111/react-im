import React from 'react'
import { Grid, List } from 'antd-mobile'
import PropTypes from 'prop-types'

class AvatarSelector extends React.Component<any, any> {
  static propTypes = { // 类型检测
    selectAvatar: PropTypes.func.isRequired
  }

  constructor (props: any) {
    super(props)
    this.state = {}
  }
  
  componentWillMount () {}

  render () {
    const avatarList = 'boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra'
      .split(',')
      .map((v: any) => {
        return {
          icon: require(`../img/${v}.png`),
          text: v
        }
      })
    
    const gridHeader: any = this.state.icon
      ? (<div>
          <span>已选择头像</span>
          <img style={{width: 20}} src={this.state.icon} alt='avatar' />
        </div>)
      : '请选择头像'

    return (
      <div>
        <List renderHeader={() => gridHeader}>
          <Grid 
            data={avatarList} 
            columnNum={5} 
            onClick={(item: any) => {
              this.setState(item)
              this.props.selectAvatar(item.text)
            }}
          />
        </List>
      </div>
    )
  }
}

export default AvatarSelector
