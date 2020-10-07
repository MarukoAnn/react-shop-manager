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
		return http.get('/item/brand/page', data)
	}
	// 新增品牌
	static addBrandInfo(data){
		return http.post('/item/brand/save', data)
	}
	// 修改品牌
    static updateBrandInfo(data){
		return http.post('/item/brand/update', data)
	}
	// 删除品牌
	static delBrandInfo(data){
		return http.post(`/item/brand/delete/${data}`)
	}
	// 根据品牌id查询分类
	static getSortById(data){
		return http.get(`/item/brand/brand`, data)
	}

	// 获取分类树列表
	static getSortTree(data) {
		return http.get('/item/v1/category/of/fuid', data)
	}
	/*---------------------------------------------分类列表-------------------------------------------------*/
	// 获取分类树结构
	static getSortTrees(data) {
		return http.get('/item/v1/category/findTree', data)
	}

	// 新增/编辑分类
	static addSort(data) {
		return http.post('/item/v1/category/addoredit', data)
	}
	// 根据id查询分类详细信息
	static getSortInfoById(data) {
		return http.get('/item/v1/category/fenleilist', data)
	}
	// 删除分类信息
	static delSort(data) {
		return http.post(`/item/v1/category/delete/${data}`, {})
	}
	/*---------------------------------------------规格列表-------------------------------------------------*/
	// 获取分类规格列表
	static getStandardList(data) {
		return http.get('/item/guige/param/queryParams', data)
	}
	// 新增规格
	static addStandard(data) {
		return http.post('/item/guige/group/add', data)
	}
	// 新增规格
	static updateStandard(data) {
		return http.post('/item/guige/group/update', data)
	}
	// 根据id查询规格详细信息
	static getStandardInfoById(data) {
		return http.get('/item/v1/category/fenleilist', data)
	}
	// 删除规格信息
	static delStandardInfo(data) {
		return http.post(`/item/guige/group/delete/${data}`, {})
	}


	/*---------------------------------------------图片上传-------------------------------------------------*/
	// 获取上传图片的密钥和地址
	static getSinature() {
		return http.get(`/upload/signature`)
	}
	// 上传图片
	static getImageUrl(url, data) {
		return http.post(url, data)
	}
}
