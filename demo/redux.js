export function createStore (reducer, enhancer) {
  if (enhancer) { // 中间件用到
    return enhancer(createStore)(reducer)
  }
  let currentState = {}
  let currentListeners = []

  function getState () {
    return currentState
  }

  function subscribe (listener) {
    currentListeners.push(listener)
  }

  function dispatch (action) {
    currentState = reducer(currentState, action)
    currentListeners.forEach(fn => fn())
    return action
  }

  dispatch({ type: '@INIT/REDUX' }) // 初始状态
  return { getState, subscribe, dispatch }
}

export function applyMiddleware (...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = store.dispatch

    const midApi = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    // dispatch = middlewares(midApi)(store.dispatch)
    const middlewareChain = middlewares.map(middleware => middleware(midApi))
    dispatch = compose(...middlewareChain)(store.dispatch)
    return {
      ...store,
      dispatch
    }
  }
}

export function compose (...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((result, item) => (...args) => result(item(...args)))
}

// { addGun, removeGUN }
function bindActionCreator (creator, dispatch) {
  // 透传参数
  return (...args) => dispatch(creator(...args))
}
export function bindActionCreators (creators, dispatch ) {
  // let bound = {}
  // Object.keys(creators).forEach(v => {
  //   let creator = creators[v]
  //   bound[v] = bindActionCreator(creator, dispatch)
  // })
  // return bound
  return Object.keys(creators).reduce((result, item) => {
    result[item] = bindActionCreator(creators[item], dispatch)
    return result
  }, {})
}
