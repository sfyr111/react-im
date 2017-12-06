import React from 'react'
import { connect } from 'react-redux'
import { getUserList } from '../../redux/chatuser.redux'
import UserCard from '../../component/usercard/usercard'

@(connect(
  (state: any) => state.chatuser,
  { getUserList }
) as any)
class Boss extends React.Component<any, any> {
  constructor (props: any) {
    super(props)
    this.state = {
      data: []
    }
  }

	componentDidMount () {
    this.props.getUserList('genius')
  }
  
	render(){

    return <UserCard userList={this.props.userList} />
	}

}
export default Boss