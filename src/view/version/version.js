import React, {useEffect, useState} from 'react';
import LnTable from '../../components/ln_react_table'
import verSrv from '../../service/service'
import {EditFilled, DeleteFilled} from '@ant-design/icons'
import {Button, Modal, Form, Input,
	message, Select, Row, Col, Switch, Tag, Tooltip, InputNumber  } from 'antd'
import {tableContext, uploadContext} from '../../util/context'
import LnUploadFile from '../../components/ln_upload_chunk'
import './version.scss'
// 设置btn 按钮
const layout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 18 },
};
const { Option } = Select;
let gameListData = [];
const validateMessages = {
	required: '${label} is required!',
	types: {
		email: '${label} is not validate email!',
		number: '${label} is not a validate number!',
	},
	number: {
		range: '${label} must be between ${min} and ${max}',
	},
};
let updayeId = '';
export default function Version(){
 	const [columns, setColumns] = useState([]);
 	const [data, setData] = useState([]);
 	const [visible, setVisible] = useState(false);
 	// const [gameList, setGameList] = useState([]);
 	const [gameType, setGameType] = useState('')
 	const [packageurl, setPackageUrl] = useState('')
 	const [upgradeurl, setUpgradeUrl] = useState('')
 	const [loading, setLoading] = useState(true)
	const [resFlag, setResFlag] = useState('add')
	const [form] = Form.useForm();
	 // 生命周期钩子
 	useEffect(() => {
		verSrv.getGameList().then(res => {
			// 将对象转为数组
			gameListData = Object.values(res.data)
			// 设置列表的值
			initVersionTableList(gameType);
			// 设置model显示
		})
	}, [])

	// 初始化列表函数
	const  initVersionTableList = (data) => {
		setLoading(true)
		verSrv.getVersionTableList(`game_id=${data}`).then(val => {
			const header = [];
			val.data.header.forEach(val => {
				header.push({title: val.name, dataIndex: val.id});
			})
			header.forEach(val =>{
				if (val.dataIndex === 'status'){
					val.render = (row) => {
						const  color = row ==='禁用'? 'red': 'green'
						return <Tag color={color}>
							{row}
						</Tag>
					}
				}else if (val.dataIndex === 'force_update'){
					// 设置行省略过长的数据,
					val.ellipsis = {showTitle: false,}
					val.render = (row) => {
						const  color = row ==='是'? 'volcano': 'magenta'
						return <Tooltip placement="topLeft" title={row}>
								<Tag color={color}>
									{row}
								</Tag>
						</Tooltip>
					}
				}else {
					// 设置行省略过长的数据,
					val.ellipsis = {showTitle: false,}
					// 使用 tooltip 显示省略的数据
					val.render = (row) => {
						return   <Tooltip placement="topLeft" title={row}>
							{row}
						</Tooltip>
					}
				}
			})
			setLoading(false)
			header.push(
				{
					title: '操作',
					key: 'operation',
					fixed: 'right',
					width: 100,
					render: (row) => {
                      return {children: btnList(row)}
					},
				},
			)
			setColumns(header)
			setData(val.data.rows.map((val, index) => {
				val.key = index + 1
				// 显示游戏名字
				gameListData.forEach(v => {
					if (v.game_id.toString() === val.game_id){
						val.game_name = v.game_name;
					}
				})
				val.status = val.status === '1'? '开启' : '禁用'
				val.force_update = val.force_update === '1'? '是' : '否'
				return val
			}));
		})
	}

	// 新增点击函数
	const showAddModel = () => {
		setVisible(true)

	}

	// 自定义编辑函数
	const editData = (e) => {
		updayeId = e.id;
		form.setFieldsValue({
			'game_id': parseInt(e.game_id),
			'version': e.version,
			'version_name': e.version_name,
			'package_link': e.package_link,
			'update_package_link': e.update_package_link,
			'status': e.status === '开启',
			'force_update': e.force_update === '是',
		})
		setUpgradeUrl(e.update_package_link)
		setPackageUrl(e.package_link)
		setResFlag('update')
		setVisible(true)

	}
	// 自定义删除事件 
	const delDataClick = () => {
 		console.log('删除');
	}
	// 弹窗确认点击事件
	const  handleCancel = () => {
		setVisible(false)
		resetData()
	}
	// 弹窗确认点击击事件
	const  handleOk = () => {
 		// 效验参数是否填写
 		form.submit();
	}
	// from 表单效验成功后回调的函数
	const onFinish = () => {
 		form.setFieldsValue({status: form.getFieldsValue().status? 1 : 0})
 		form.setFieldsValue({force_update: form.getFieldsValue().force_update? 1 : 0})
		if (resFlag === 'add') {
			verSrv.addGameVersionInfo(form.getFieldsValue()).then(val => {
				if (val.code === 0){
					resetData()
				}else {
					message.error(val.msg)
				}
			})
		}else {
			const data = JSON.parse(JSON.stringify(form.getFieldsValue()))
			data.id  = updayeId;
			verSrv.updateGameVersionInfo(data).then(val => {
				if (val.code === 0){
					resetData()
				}else {
					message.error(val.msg)
				}
			})
		}

 		// console.log(234);
	}
	// 重置函数
	const resetData = () => {
		setVisible(false)
		form.resetFields();
		setUpgradeUrl('')
		setPackageUrl('')
		initVersionTableList(gameType);
		setResFlag('add')
	}

	// 列表的操作按钮视图
	const btnList = (e) => {
		return <div>
			{/* eslint-disable-next-line no-use-before-define */}
			<label style={{margin: '4px 16px'}} onClick={() => {editData(e)}}><EditFilled /></label>
			{/*<label onClick={() => {delDataClick(e)}}><DeleteFilled /></label>*/}
		</div>
	}


	// 表单视图
	const formValue =  <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} validateMessages={validateMessages}>
		<Form.Item name={'game_id'} label="游戏" rules={[{ required: true }]}>
			<Select  placeholder="请选择游戏">
				{
					gameListData.map(v => {
						return <Option key={v.game_id} value={v.game_id}>{v.game_name}</Option>
					})
				}
			</Select>
		</Form.Item>
		<Form.Item name={'version'} label="版本号" rules={[{ required: true }]}>
			<InputNumber min={0} max={9999} step={1} placeholder="请输入版本号"/>
		</Form.Item>
		<Form.Item name={'version_name'} label="版本名" rules={[{ required: true }]}>
			<Input placeholder="请输入版本名"/>
		</Form.Item>
		<Form.Item name={'status'} label="状态" rules={[{ required: true }]} valuePropName={'checked'} initialValue={false}>
			<Switch  />
		</Form.Item>
		<Form.Item name={'package_link'} label="整包链接" rules={[{ required: true }]}>
			<Row>
				<Col span={19}>
					<Input  disabled={true} value={packageurl}/>
				</Col>
				<Col span={5}>
					<LnUploadFile changeUrl={(url) => {setPackageUrl(url);form.setFieldsValue({
						package_link: url})}}/>
				</Col>
			</Row>
		</Form.Item>
		<Form.Item name={'update_package_link'} label="升级包链接" rules={[{ required: true }]}>
			<Row>
				<Col span={19}>
					<Input disabled={true} value={upgradeurl}/>
				</Col>
				<Col span={5}>
					<LnUploadFile changeUrl={(url) => {setUpgradeUrl(url);form.setFieldsValue({
						update_package_link: url})}}/>
				</Col>
			</Row>
		</Form.Item>

		<Form.Item name={'force_update'} label="是否允许升级" rules={[{ required: true }]} valuePropName={'checked'} initialValue={true}>
			<Switch />
		</Form.Item>
	</Form>

	// 弹窗视图
	const Model =  <Modal
		visible={visible}
		getContainer={false}
		mask={true}
		maskClosable={false}
		width={800}
		title="编辑"
		onOk={handleOk}
		onCancel={handleCancel}
		footer={[
			<Button key="back" onClick={handleCancel}>
				取消
			</Button>,
			<Button type="primary" onClick={handleOk}>
				确认
			</Button>
		]}
	>
		{/*下拉框*/}
		<div>
			{formValue}
		</div>

	</Modal>

	// 返回视图
    return (
        <div className="version">
            <div>
				<Select  placeholder="请选择游戏" style={{width: '12%',marginRight: '10px'}}  onChange={(e) => {console.log(e);setGameType(e)}}>
					{
						gameListData.map(v => {
							return <Option key={v.game_id} value={v.game_id}>{v.game_name}</Option>
						})
					}
				</Select>
				<Button onClick={() => {initVersionTableList(gameType)}} style={{background: '#27904C',color: '#fff',border: '1px solid #27904C'}}>搜索</Button>
			</div>
			<div className="btn-list">
				<Button type="primary" onClick={showAddModel}>新增</Button>
				{/*<Button type="primary" onClick={() => {console.log(url)}}>获取url</Button>*/}
			</div>
			<div className="table-body">
				{/*父子传参*/}
				<tableContext.Provider value={{header: columns, value: data, loading: loading}}>
					<LnTable  />
				</tableContext.Provider>
			</div>
			<div>
				{Model}
			</div>

        </div>
    )
}
