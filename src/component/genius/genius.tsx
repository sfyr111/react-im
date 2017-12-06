import React from 'react'
import { connect } from 'react-redux'
import { getUserList } from '../../redux/chatuser.redux'
import UserCard from '../../component/usercard/usercard'

@(connect(
  (state: any) => state.chatuser,
  { getUserList }
) as any)
class Genius extends React.Component<any, any> {
  constructor (props: any) {
    super(props)
    this.state = {}
  }

	componentDidMount () {
    this.props.getUserList('boss')
  }
  
	render(){

    return <UserCard userList={this.props.userList} />
	}

}
export default Genius