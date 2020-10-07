/**
 * @Auter: moonshine
 * @Date: 2020/08/11  10:45
 * @desc: 拦截器
 * @variable:
 */
import axios from 'axios'
import {Modal} from 'antd'
import React from "react";
if (process.env.NODE_ENV === 'development') {
	// if (axios.co)
	axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
} else if (process.env.NODE_ENV === 'production') {
	axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
}

//设置的请求次数，请求的间隙
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;
// 全局设置超时时间
axios.defaults.timeout = 30000;

axios.interceptors.request.use((config) => {
	if(!Object.is(config.url, undefined)){
		if (config.url.includes('https')){
			config.baseURL = ''
			// config.url = config.url.slice(6,  config.url.length -1)
			// config.headers.post['Content-Type'] =  'multipart/form-data'
		}
		// const action = changeLoadingAction();
		// store.dispatch(action);
		// store.dispatch('changeLoading');
		// store.dispatch("setLoadingStatus", "showLoading");
		// // if (config.url === '/userInformation/updateUser'){
		// //   config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
		// // }
		// // if (config.url.includes('./user/login')) {
		// //     config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
		// // } else {
		// //     config.headers.post['appkey'] = localStorage.getItem('appkey');
		// // }
		// config.headers.post['appkey'] = localStorage.getItem('appkey')
	}
	return config;
}, error => {
	return Promise.reject(error)
});

// 请求到结果的拦截处理
axios.interceptors.response.use( (config) => {
	// store.dispatch("setLoadingStatus", "hideLoading");
	// const action = changeLoadingAction();
	// store.dispatch(action);
	// 返回请求正确的结果
	if (config.status === 200) {
		if (!config.data.status){
			return config.data;
		}else {
			Modal.error({
				title: '请求错误',
				content: (
					<div>
						<p>{config.data.massage}</p>
						{/*<p>{config.config.baseURL + config.config.url}</p>*/}
					</div>
				),
				okText: '确定'
			});
		}
	}else {
		Modal.error({
			title: '链接服务器失败, 请稍后重试',
			content: (
				<div>
					<p>{config.config.baseURL + config.config.url}</p>
				</div>
			),
			okText: '确定'
		});
		// window.alert('链接服务器失败，请稍后重试！')
		// router.push({path: '/error'});  // 进入错误界面
	}
}, (error) => {
	return Promise.reject(error)
	// 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
});

// 封装请求
class ClientHttp {
	// eslint-disable-next-line no-useless-constructor
	constructor() {
	}
	/**
	 * get 请求
	 * @param url 请求连接
	 * @param data 请求参数
	 */

	get(url, data) {
		return new Promise(((resolve, reject) => {
			axios.get(url + `?${data}`).then(res => {
					resolve(res)
				}
			).catch(err => {
				reject(err);
			})
		}));
	}
	/**
	 * get 请求
	 * @param url 请求连接
	 * @param data 请求参数
	 */

	getPost(url, data) {
		return new Promise(((resolve, reject) => {
			axios({
				method: 'get',
				url: url,
				params: data
			}).then(res => {
					resolve(res)
				}
			).catch(err => {
				reject(err);
			})
		}));
	}
	/**
	 * get 方式
	 * @param url 请求连接
	 * @param data 请求参数
	 *  服务端签名上传 oos
	 */

	getImgUrl(url, datas) {
		return new Promise(((resolve, reject) => {
			axios({
				method: 'post',
				url: url,
				data: datas,
				header: { 'Content-Type': 'multipart/form-data' }
			}).then(res => {
					resolve(res)
				}
			).catch(err => {
				reject(err);
			})
		}));
	}
	/**
	 * post 请求
	 * @param url  请求连接
	 * @param data  请求参数
	 */
	post(url, data){
		return new Promise(((resolve, reject) => {
			axios.post(url, data).then(res => {
				resolve(res)
			}).catch(err => {
				reject(err)
			})
		}));

	}
}

export default ClientHttp
