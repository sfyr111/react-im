import axios from 'axios'
import { getRedirectPath } from '../util'
import { Dispatch } from 'redux'

const AUTH_SUCCESS = 'AUTH_SUCCESS'
const ERROR_MSG = 'ERROR_MSG'
const LOAD_DATA = 'LOAD_DATA'
const LOGOUT = 'LOGOUT'

const initState = {
  redirectTo: '', // 跳转的目标
  // isAuth: '',
  msg: '',
  user: '',
  // pwd: '',
  type: ''
}

// reducer
export function user (state = initState, action: any) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return { ...state, msg: '', redirectTo: getRedirectPath(action.payload), ...action.payload }
    case ERROR_MSG:
      return { ...state, isAuth: false, msg: action.msg }
    case LOAD_DATA:
      return { ...state, ...action.payload }
    case LOGOUT:
      return { ...initState, redirectTo: '/login' }
    default:
      return state
  }
}

function authSuccess (obj: any) {
  const { pwd, ...data } = obj // 过滤掉pwd
  return { type: AUTH_SUCCESS, payload: data}
}

function errorMsg (msg: any) {
  return { type: ERROR_MSG, msg }
}

export function loadData (userInfo: any) {
  return { type: LOAD_DATA, payload: userInfo}
}

export function logoutSubmit () {
  return { type: LOGOUT }
}

export function update (data: object) {
  return (dispatch: Dispatch<any>) => {
    axios.post('/user/update', data)
      .then((res: any) => {
        if (res.status === 200 && res.data.code === 0) {
          dispatch(authSuccess(res.data.data))
        } else {
          dispatch(errorMsg(res.data.msg))
        }
      }) 
  }
}

export function login (state: { user: string, pwd: string }) {
  const { user, pwd } = state
  if (!user || !pwd) {
    return errorMsg('用户名密码必须输入')
  }
  return (dispatch: Dispatch<any>) => {
    axios.post('/user/login', { user, pwd })
      .then((res: any) => {
        if (res.status === 200 && res.data.code === 0) {
          dispatch(authSuccess(res.data.data))
        } else {
          dispatch(errorMsg(res.data.msg))
        }
      })    
  }
}

export function register (state: { user: string, pwd: string, repeatpwd: string, type: string }) {
  const { user, pwd, repeatpwd, type } = state
  if (!user || !pwd || !type) {
    return errorMsg('用户名密码必须输入')
  }
  if (pwd !== repeatpwd) {
    return errorMsg('密码和确认密码不同')
  }
  return (dispatch: Dispatch<any>) => {
    axios.post('/user/register', { user, pwd, type })
      .then((res: any) => {
        if (res.status === 200 && res.data.code === 0) {
          dispatch(authSuccess({ user, pwd, type }))
        } else {
          dispatch(errorMsg(res.data.msg))
        }
      })    
  }
}