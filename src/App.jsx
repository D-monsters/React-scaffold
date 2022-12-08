/*
 * @Author: fdhou
 * @Date: 2022-12-06 15:48:32
 * @LastEditors: fdhou
 * @LastEditTime: 2022-12-07 17:57:57
 * @Description: 
 */
import React from "react";
import { Link, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Button } from 'antd'
// import Home from "./pages/Home";
// import About from './pages/About'
const Home = lazy(() => import(/* webpackChunkName:'home' */'./pages/Home'))
const About = lazy(() => import(/* webpackChunkName:'about' */'./pages/About'))
function App() {
  return (
    <div>
      <h1>欢迎来到React页面</h1>
      <Button type="primary">按钮</Button>
      <ul>
        <li>
          <Link to='/Home'>home</Link>
        </li>
        <li>
          <Link to='/About'>about</Link>
        </li>
      </ul>
      <Suspense fallback={<div>loding.....</div>}>
        <Routes>
          <Route path='/Home' element={<Home />}></Route>
          <Route path='/About' element={<About />}></Route>
        </Routes>
      </Suspense>
    </div>
  )

}
export default App