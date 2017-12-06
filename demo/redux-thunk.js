// const midApi = {
//   getState: store.getState,
//   dispatch: (...args) => dispatch(...args)
// }

const thunk = (/* midApi */{ dispatch, getState }) => (/* store.dispatch */ next) => action => {
  // 两种调用方法，一种action 是函数，一种是对象 { type: '', payload }
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }
  // 默认返回
  return next(action)
}

export default thunk
