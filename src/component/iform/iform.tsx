import React from 'react'

export default function iForm (Comp: any) {
  return class WrapperComp extends React.Component<any, any> {
    constructor (props: any) {
      super(props)
      this.state = {
        // user: '',
        // pwd: '',
        // repeatpwd: '', // 注册的
        // type: 'genius' // 或 boss 注册的
      }
      this.handleChange = this.handleChange.bind(this)
    }

    handleChange (key: string, val: string): void {
      console.log('HOC', key, val)
      
      this.setState({
        [key]: val
      })
    }

    render (): any {
      // 属性穿透
      return <Comp handleChange={this.handleChange} state={this.state} {...this.props} />
    }
  }
}
