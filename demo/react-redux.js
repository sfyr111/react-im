/**
 * App = connect(
 *  state => state,
 * { fn }
 * )(App)
 */

import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from './redux';
// HOC
// export function connect (mapStateToProps, mapDispatchToProps) {
//   return function (WrapComponent) {
//     return class ConnectComponent extends React.Component {

//     }
//   }
// }

// App = connect(
//   state => state,
//   {}
// )(App)
export const connect = (mapStateToProps = (state => state), mapDispatchToProps = {}) => (WrapComponent) => {
  return class ConnectComponent extends React.Component {
    static contextTypes = {
      store: PropTypes.object // 就是个对象，createStore 的return 值
    }

    constructor(props, context) {
      super(props, context)
      this.state = {
        props: {} // 即将传递给 WrapComponent 的属性
      }
    }

    componentDidMount () {
      const { store } = this.context
      // 监听
      store.subscribe(() => this.update())
      this.update()
    }

    update () {
      // 获取 mapStateToProps、mapDispatchToProps 放入 this.props 内
      const { store } = this.context
      const stateProps = mapStateToProps(store.getState())
      // 方法不能直接给，需要dispatch, 直接执行没意义，需要fn = () => store.dispatch(fn())
      // 用dispatch 把 actionsCtreators 包裹一层
      // function fn () {
      //   return { type: 'FN' }
      // }
      const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)
      this.setState({ // 让WrapComponent 有获取功能
        props: {
          ...this.state.props,
          ...stateProps,
          ...dispatchProps
        }
      })
    }

    render () {
      // WrapComponent 就是我们平时用的 APP
      return <WrapComponent {...this.state.props } />
    }
  }
}

export class Provider extends React.Component {
  static childContextTypes = {
    store: PropTypes.object
  }

  getChildContext () {
    return { store: this.store }
  }

  constructor (props, context) {
    super(props, context)
    this.store = props.store
  }
  
  render () {
    return this.props.children
  }
}
