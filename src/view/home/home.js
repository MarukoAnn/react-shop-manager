import React, {useState, useEffect}  from 'react';
import {HashRouter as Router, Link, Redirect, Route} from "react-router-dom";
//  导入路由组件
// import HomeRouters from '../../router/routers.js'
import imgURL from '../../assets/images/Lnlogo.png'
import { Layout, Menu, Avatar } from 'antd';
import './home.css'
import {
	MenuUnfoldOutlined,
	UserOutlined,
	MenuFoldOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons';
import routes from '../../router/routers'
import version from '../version/version'
import icon from '../list/icon'
const { Header, Sider, Content } = Layout;
// const routes = [
//   ...require('../../router/routers')
// ]

export default function Home(){
    const [collapsed, setCollapse] = useState(false)
    const toggle = () => {
      setCollapse(!collapsed)
    }
    useEffect(() =>{
	})
    return <div className="Home">
      <Layout className="Home">
         <Header className="site-layout-background" style={{ padding: 0, display: process.env.NODE_ENV === 'development'? 'block' : 'none' }}>
			 <div style={{display: 'flex', justifyContent: 'space-between'}}>
				 <div style={{display: 'flex',width: '80vw'}}>
					 {/*<img src={imgURL} alt="" style={{width: '86px',height: '48px',marginLeft: '50px',marginTop: '8px'}} />*/}
					 <h2 style={{marginLeft: '2vw', color: '#fff'}}>商城管理平台</h2>
				 </div>
				 <div style={{width: '10%',display:'flex',alignItems: 'center'}}>
					 <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>AN</Avatar>
					 <span style={{color: '#fff', marginLeft: '10px'}}>admin</span>
				 </div>
			 </div>
			{/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {*/}
            {/*  className: 'trigger',*/}
            {/*  onClick: toggle,*/}
            {/*})}*/}
          </Header>
        <Layout className="site-layout">
         <Router>
          <Sider trigger={null} collapsible collapsed={collapsed} style={{display: process.env.NODE_ENV === 'development'? 'block' : 'none'}}>
          {/*<div className="logo" />*/}
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/home/version" >用户列表</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              <Link to="/home/icon" >商品列表</Link>
            </Menu.Item>
            {/*<Menu.Item key="3" icon={<UploadOutlined />}>*/}
            {/*  nav 3*/}
            {/*</Menu.Item>*/}
          </Menu>
        </Sider>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            {/*重定向*/}
            {/*<Redirect from="/home" to="/home/version"/>*/}
			{/*版本路由*/}
			<Route path={'/home/version'} component={version} />
			{/*Icon路由*/}
			<Route path={'/home/icon'} component={icon} />
          </Content>
          </Router>
        </Layout>
      </Layout>
    </div>
}
