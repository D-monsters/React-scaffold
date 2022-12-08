/*
 * @Author: fdhou
 * @Date: 2022-12-06 15:45:49
 * @LastEditors: fdhou
 * @LastEditTime: 2022-12-07 17:39:28
 * @Description: 
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'antd/dist/antd.less'
const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)