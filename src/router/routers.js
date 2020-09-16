// import React from 'react';
// import {BrowserRouter as Router, Link, Route} from "react-router-dom";
// import asyncComponent from 'react-router-config'


import version from '../view/version/version'
import Icon from '../view/list/icon'
import Home from '../view/home/home'

const routes = [
	{
		path:'/home',
		component: Home,
		routes: [
			{
				path: '/icon',
				component: Icon
			},
			{
				path: '/version',
				component: version
			}
		]
	}
]


export default routes
