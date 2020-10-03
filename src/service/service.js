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

	// 获取分类树
	static getSortTree(data) {
		return http.get('/v1/category/of/fuid', data)
	}

	// 新增分类
	static addSort(data) {
		return http.post('/v1/category/addoredit', data)
	}
	// 根据id查询分类详细信息
	static getSortInfoById(data) {
		return http.get('/v1/category/fenleilist', data)
	}
	// 删除分类信息
	static delSort(data) {
		return http.post(`/v1/category/delete/${data}`, {})
	}
}
