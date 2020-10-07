import React, {useState, useEffect}  from 'react';
import {HashRouter as Router, Link, Redirect, Route} from "react-router-dom";
//  导入路由组件
// import HomeRouters from '../../router/routers.js'
import { Layout, Menu, Avatar } from 'antd';
import './home.css'
import {
    LaptopOutlined,
    AppstoreOutlined,
    PartitionOutlined,
    BlockOutlined
} from '@ant-design/icons';
import routes from '../../router/routers'
import version from '../version/version'
import icon from '../list/icon'
import brand from '../brand/brand'
import sort from "../sort/sort";
import standard from "../standard/standard";
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

export default function Home(){
    const [collapsed, setCollapse] = useState(false)
    const toggle = () => {
      setCollapse(!collapsed)
    }
    useEffect(() =>{
	})
    return <div className="Home">
      <Layout className="Home">
         <Header className="site-layout-background" style={{ padding: 0}}>
			 <div style={{display: 'flex', justifyContent: 'space-between'}}>
				 <div style={{display: 'flex',width: '80vw'}}>
					 <h2 style={{marginLeft: '2vw', color: '#fff'}}>商城管理平台</h2>
				 </div>
				 <div style={{width: '10%',display:'flex',alignItems: 'center'}}>
					 <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>An</Avatar>
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
          <Sider trigger={null} collapsible collapsed={collapsed}>
          {/*<div className="logo" />*/}
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
              <SubMenu key="sub1" icon={<AppstoreOutlined />} title="商品分类">
                  <Menu.Item key="1" icon={<LaptopOutlined />}>
                      <Link to="/home/brand" >品牌列表</Link>
                  </Menu.Item>
                  <Menu.Item key="2" icon={<PartitionOutlined />}>
                      <Link to="/home/sort" >分类列表</Link>
                  </Menu.Item>
                  {/*<Menu.Item key="3" icon={<BlockOutlined />}>*/}
                  {/*    <Link to="/home/stand" >规格列表</Link>*/}
                  {/*</Menu.Item>*/}
              </SubMenu>
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
            <Redirect from="/home" to="/home/brand"/>
			{/*品牌路由*/}
			{/*<Route path={'/home/version'} component={version} />*/}
			{/*/!*Icon路由*!/*/}
			{/*<Route path={'/home/icon'} component={icon} />*/}
			<Route path={'/home/brand'} component={brand} />
			<Route path={'/home/sort'} component={sort} />
			<Route path={'/home/stand'} component={standard} />
          </Content>
          </Router>
        </Layout>
      </Layout>
    </div>
}
