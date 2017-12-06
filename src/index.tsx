import React from 'react'
import ReactDom from 'react-dom'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { HashRouter } from 'react-router-dom'

import App from './app'

import reducers from './reducer'
import './index.css'
import './config'
import 'antd-mobile/dist/antd-mobile.min.css'
// declare global {
//   interface Window { devToolsExtension: any }
// }

const store = createStore(reducers, compose(
	applyMiddleware(thunk),
	(window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: {}) => f
))

/** pages
 * boss
 * genius
 * me
 * msg
 */
// router+redux
ReactDom.render(
	(
		<Provider store={store}>
			<HashRouter>
				<App />
			</HashRouter>
		</Provider>
	),
	document.getElementById('root')
)
