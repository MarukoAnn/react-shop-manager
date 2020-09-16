import React, {useContext, useRef, useState} from "react";
import {Button, message, Modal, Progress} from 'antd';
import uploadSrv from '../service/service'
import {fileContext} from "../util/context";
const chunkNumber = 500 * 1024;
let flag = 0;
function UploadFile(props) {
	const {changeUrl} = props;
	const [visible, setVisible] = useState(false)
	const [fileName, setFileName] = useState('')
	const [percent, setPercent] = useState(0)
	const fileUploadType = useContext(fileContext);
	const fileRef = useRef()
	// 选择文件后的操作
	const onChange = (e) => {
		// 判断文件长度是否为空
		if (e.target.files.length > 0) {
			// 获取文件
			const file = e.target.files[0]
			// 设置弹窗显示
			setVisible(true)
			//获取文件名称
			setFileName(file.name);
			// 获取切片集合
			if (fileUploadType !== null){
				uploadImgRequest(file)
			}else {
				const datalist = createFileChunk(file, chunkNumber)
				uploadFileRequest(datalist, file.name)
			}
			// setFileChunkList([...])
			// console.log(datalist);
		}
	}
	const handleOk = () => {

		// setVisible(false)
	}
	const handleCancel = () => {
		setVisible(false)
	}

	// 文件切片
	const createFileChunk = (file, length) => {
		// 定义切片数组
		const fileChunkList = [];
		// 获取总的切片长度
		const chunkSize = Math.ceil(file.size / length);
		// 截取下标
		let  cur = 0;
		// 切片次数
		let i = 0;
		while (i < chunkSize){
		// 	//将文件切成片
			const fileChunk = file.slice(cur, cur + length)
		// 	// 将每一片文件存放在数组中(音频文件是Blob类型)
			fileChunkList.push(fileChunk)
		// 	// 是否继续循环判断
			i += 1;
			cur += length;
		}
		return fileChunkList;
	}
	// 上传文件
	const uploadFileRequest = (list, name) => {
		// 判断文件片段长度
		if (flag < list.length){
			const formData = new FormData();
			formData.append('file', list[flag]);
			formData.append('file_name', name);
			formData.append('time', parseInt(new Date().getTime() / 1000))
			formData.append('chunk', flag)
			formData.append('chunks', list.length)
			// 上传文件的氢气
			uploadSrv.uploadFile(formData).then(val => {
				flag += 1
				if (flag < list.length){
					// 计算加载条的长度
					setPercent(Math.floor((flag / list.length) *100))
					// 如果片段没传完就递归继续传输
					uploadFileRequest(list, name)
				}else {
					// 设置加载进度条为 100%
					setPercent(100)
					// 传递 成功后的文件地址给父组件
					if (val.succ && val.succ.Filedata && val.succ.Filedata.save_path){
						changeUrl(val.succ.Filedata.save_path)
					}else {
						message.error('服务器处理异常')
					}
					// 设置延时关闭弹窗，重置参数。
					setTimeout(() => {
						setVisible(false)
						setPercent(0)
						flag = 0
						fileRef.current.value = ''
					}, 1000)
				}
			})
		}
	}
	// 上传图片
	const uploadImgRequest = (file) => {
		const imgform = new FormData()
		imgform.append('file', file)
		// setPercent(Math.floor(Math.random(0, 1) * 100))
		// 设置上传图片的接口
		uploadSrv.updateIconImg(imgform).then(val => {
			// 设置加载条的进度
			setPercent(100)
			// 传将地址输给父组件
			changeUrl(val.data.url)
			// 延时关闭弹窗 清空数据
			setTimeout(() => {
				setVisible(false)
				setPercent(0)
				fileRef.current.value = ''
			}, 1000)
		})
	}
	// 弹窗视图
	const Model =  <Modal
		visible={visible}
		mask={true}
		maskClosable={false}
		width={600}
		centered={true}
		title="文件上传"
		onOk={handleOk}
		onCancel={handleCancel}
		footer={[
			<Button key="back" onClick={handleCancel}>
				取消
			</Button>
		]}
	>
		<div>
			<header>
				<h2 style={{textAlign: 'center'}}>上传中</h2>
			</header>
			<p><span>文件名称：</span>{fileName}</p>
			{/*显示进度条*/}
			<Progress percent={percent} status="active" />
		</div>

	</Modal>

	return (
		<div style={{position: 'relative'}}>
			<input type="file"
				   ref={fileRef}
				   onChange={onChange} style={{position: "absolute",zIndex: 10,width:'100%',height: '100%',opacity: 0}}/>
			<Button type="primary" style={{width: '100%',height: '100%'}}>文件上传</Button>
			{Model}
		</div>
	)
}
// accept={'application/vnd.android.package-archive, application/octet-stream.ipa'}


export default UploadFile
