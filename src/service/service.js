/**
 * @Auter: moonshine
 * @Date: 2020/08/11  10:45
 * @desc: 所有的服务请求连接  中间层
 * @variable:
 */
import httpClient from '../util/interceptors.js'
const http = new httpClient();
export default class service {

	/*
	*--------------------品牌管理模块--------------------------
	* */

	// 获取品牌管理列表
	static getBrandList(data) {
		return http.get('/brand/page', data)
	}
}
