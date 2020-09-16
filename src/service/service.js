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
	*--------------------版本信息模块--------------------------
	* */

	// 获取表格数据
	static getVersionTableList(data) {
		return http.get('/Package/getList', data)
	}

	// 获取游戏下拉框选择数据
	static getGameList(data) {
		return http.get('/Game/getList', data)
	}

	// 添加游戏版本数据
	static addGameVersionInfo(data) {
		return http.getPost('/Package/add', data)
	}

	// 更新游戏版本数据
	static updateGameVersionInfo(data) {
		return http.getPost('/Package/update', data)
	}

	// 上传文件
	static uploadFile(data) {
		return http.post('/pcPackageUpload.class.php', data)
	}

	/*
	*--------------------图标管理模块--------------------------
	* */
    // 获取Icon列表
	static getIconTableList(data) {
		return http.get('/GameInfo/getList', data)
	}
	// 添加Icon信息
	static addIconInfo(data) {
		return http.getPost('/GameInfo/add', data)
	}
	// 更新Icon信息
	static updateIconInfo(data) {
		return http.getPost('/GameInfo/update', data)
	}

	// 上传icon图片
	static updateIconImg(data) {
		return http.post('/GameInfo/upload', data)
	}
}
